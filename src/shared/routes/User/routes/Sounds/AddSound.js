import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import * as Sentry from '@sentry/browser';
import { useForm } from 'components/hooks/useForm';
import useConnectSoundCloud from 'components/hooks/useConnectSoundcloud';
import DateInput from 'components/DateInput';
import { Input, InputRow, InputLabel, Checkbox } from '../../../../components/FormComponents';
import { Title, Body, BodySmall, InlineLink } from '../../../../components/Text';
import {
    Row,
    TeritaryButton,
    SmartButton,
    Col,
    SecondaryButton,
} from '../../../../components/Blocks';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';
import ImageUploader from '../../../../components/ImageInput';
import { ProgressBar } from '../../components/ProfileProgress';
import { UPLOAD_FILE } from '../../gql';
import GracefullImage from '../../../../components/GracefullImage';
import TagInput from './TagInput';
import { ADD_SOUND, UPDATE_SOUND, USER_SOUNDS } from './gql';
import useSongMetadata from './useSongMetadata';

const AddSound = (props) => {
    const { sound, soundCloudConnected, userId } = props;
    const [uploadProgress, setuploadProgress] = useState(sound ? 1 : null);
    const abortUpload = useRef();
    const [file, setFile] = useState();
    const [fileId, setFileId] = useState();
    const [addToSoundCloud, setAddToSoundcloud] = useState(false);

    const [upload, { loading: uploading, error: uploadError }] = useMutation(UPLOAD_FILE);
    const [uploadImage] = useMutation(UPLOAD_FILE);

    const metadata = useSongMetadata({ file }) || {};

    const startUpload = async (file) => {
        setuploadProgress(0);
        setFile(file);
        const {
            data: { singleUpload },
        } = await upload({
            variables: { file },
            context: {
                fetchOptions: {
                    useUpload: true,
                    onProgress: (e) => {
                        setuploadProgress(e.loaded / e.total);
                    },
                    onAbortPossible: (abortHandler) => {
                        abortUpload.current = abortHandler;
                    },
                },
            },
        });
        setFileId(singleUpload.id);
    };

    const showForm = sound || (uploadProgress !== null && metadata.common);
    return (
        <>
            {!showForm ? (
                <FileChooser
                    onChange={startUpload}
                    userId={userId}
                    soundCloudConnected={soundCloudConnected}
                    setAddToSoundcloud={setAddToSoundcloud}
                />
            ) : (
                <DataForm
                    {...props}
                    sound={{
                        ...metadata.common,
                        tags: metadata.common && metadata.common.genre,
                        addToSoundCloud,
                        ...sound,
                    }}
                    uploadImage={uploadImage}
                    file={fileId}
                    uploading={uploading}
                    uploadingStatus={
                        uploadError ? (
                            <ErrorMessageApollo style={{ marginBottom: 0 }} error={uploadError} />
                        ) : (
                            <BodySmall style={{ marginBottom: 0 }}>
                                {uploading && uploadProgress === 1
                                    ? 'Processing track...'
                                    : uploading
                                    ? 'Uploading track...'
                                    : 'Track uploaded'}
                            </BodySmall>
                        )
                    }
                    uploadProgress={
                        uploading ? Math.min(uploadProgress, 0.95) : uploadError ? 0 : 1
                    }
                    uploadError={uploadError}
                />
            )}
        </>
    );
};

const FileChooser = ({ onChange, soundCloudConnected, userId, setAddToSoundcloud }) => {
    const [connect, { loading }] = useConnectSoundCloud({ userId, soundCloudConnected });

    return (
        <Col middle>
            <Body style={{ textAlign: 'center', maxWidth: '500px' }}>
                For the best result upload in wav or m4a. <br />
                The file will be optimised for streaming at 256 kbps.
            </Body>
            <Row style={{ margin: '24px 0 6px 0' }}>
                <span style={{ marginRight: '24px' }}>
                    <Checkbox
                        label={'Add to your Soundcloud'}
                        onChange={(checked) => {
                            if (checked && !soundCloudConnected && !loading) {
                                connect();
                            }
                            setAddToSoundcloud(checked);
                        }}
                    />
                </span>
                {/* <Checkbox label={"Add to Mixcloud"} /> */}
            </Row>
            <ImageUploader
                style={{
                    background: '#31daff',
                    color: 'white',
                    width: '250px',
                    margin: 'auto',
                    marginTop: '24px',
                }}
                name="sound"
                accept="audio/*"
                onSave={onChange}
            >
                Choose file
            </ImageUploader>

            <BodySmall style={{ textAlign: 'center', maxWidth: '500px' }}>
                By uploading, you confirm that your sounds comply with our{' '}
                <InlineLink href="/terms/agreements" target="_blank">
                    Terms of Service
                </InlineLink>{' '}
                and that you don't infringe anyone else's rights.
            </BodySmall>
        </Col>
    );
};

const DataForm = ({
    formDisabled,
    uploadProgress,
    uploadingStatus,
    uploadImage,
    sound = {},
    file,
    onCancel,
    uploadError,
    uploading,
    details,
    closeModal,
    userId,
}) => {
    const [form, setForm] = useState({
        updateOnSoundCloud: true,
        updateOnMixcloud: true,
        ...sound,
    });

    const [imageUpload, setImageUpload] = useState();
    const [submitting, setSubmitting] = useState(false);
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const onChange = (key) => (val) => {
        setForm((form) => ({ ...form, [key]: val }));
    };

    const refetchQueries = [];
    if (!form.id) {
        refetchQueries.push({
            query: USER_SOUNDS,
            variables: {
                userId,
            },
        });
    }

    const [mutate, { error }] = useMutation(form.id ? UPDATE_SOUND : ADD_SOUND, {
        refetchQueries,
        awaitRefetchQueries: true,
        onCompleted: closeModal,
    });

    const updateSound = async (e) => {
        e.preventDefault();
        const refs = runValidations();
        if (refs.length === 0) {
            try {
                setSubmitting(true);

                const variables = {
                    id: form.id,
                    title: form.title,
                    description: form.description,
                    tags: form.tags,
                    addToSoundCloud: form.addToSoundCloud,
                    file,
                    date: form.date,
                    updateOnSoundCloud: form.updateOnSoundCloud,
                    updateOnMixcloud: form.updateOnMixcloud,
                };

                if (imageUpload) {
                    const {
                        data: { singleUpload },
                    } = await imageUpload;
                    variables.image = singleUpload.id;
                } else {
                    delete variables.image;
                }

                await mutate({
                    variables,
                });
            } catch (error) {
                Sentry.captureException(error);
            } finally {
                setSubmitting(false);
            }
        }
    };

    const startUploadImage = useCallback(
        (imageFile) => {
            setImageUpload(uploadImage({ variables: { file: imageFile } }));
        },
        [setImageUpload, uploadImage]
    );

    const { title, tags, description, date, image, imageFile, source } = form || {};
    const isSoundcloud = source === 'soundcloud';
    const isMixcloud = source === 'mixcloud';

    return (
        <form onSubmit={updateSound}>
            <Title>{sound.id ? 'Update sound' : 'Add sound'}</Title>

            {!form.id && (
                <>
                    {uploadingStatus}
                    <ProgressBar progress={uploadProgress} />
                </>
            )}
            {isSoundcloud && (
                <Body>
                    This will update the sound on Soundcloud. Changes might take some time to take
                    effect.
                </Body>
            )}
            {isMixcloud && (
                <Body>
                    This will update the sound on Mixcloud. Changes might take some time to take
                    effect.
                </Body>
            )}
            <Row style={{ marginTop: '30px' }}>
                <CoverPicture
                    url={image ? image.path : null}
                    imageFile={imageFile}
                    onChange={startUploadImage}
                />
                <Col>
                    <InputRow>
                        <Input
                            label="Title"
                            defaultValue={title}
                            placeholder="Name your track"
                            type="text"
                            name="title"
                            onSave={onChange('title')}
                            disabled={formDisabled}
                            validation={(v) => (v ? null : 'Required')}
                            registerValidation={registerValidation('title')}
                            unregisterValidation={unregisterValidation('title')}
                        />
                        <DateInput
                            label="Release date"
                            defaultValue={date || (form.id ? null : new Date())}
                            placeholder="MM-YYYY"
                            type="text"
                            name="date"
                            onSave={onChange('date')}
                            disabled={formDisabled}
                        />
                        <InputLabel>
                            Tags
                            <TagInput
                                defaultValue={tags}
                                onChange={onChange('tags')}
                                placeholder="Add tags to describe the genre, style and mood"
                            />
                        </InputLabel>
                        <Input
                            defaultValue={description}
                            type="text-area"
                            label="Description"
                            disabled={formDisabled}
                            onSave={onChange('description')}
                        />
                    </InputRow>
                    {sound.soundcloudId && (
                        <Checkbox
                            label="Update entry on your Soundcloud"
                            defaultValue={form.updateOnSoundCloud}
                            onChange={onChange('updateOnSoundCloud')}
                        />
                    )}
                    {sound.mixcloudId && (
                        <Checkbox
                            label="Update entry on your mixcloud"
                            defaultValue={form.updateOnMixcloud}
                            onChange={onChange('updateOnMixcloud')}
                        />
                    )}
                    {!form.id && (
                        <Checkbox
                            label="Add to your Soundcloud"
                            defaultValue={form.addToSoundCloud}
                            onChange={onChange('addToSoundCloud')}
                        />
                    )}
                    {!form.id && (
                        <Checkbox
                            label="Add to your Mixcloud"
                            defaultValue={form.addToMixcloud}
                            onChange={onChange('addToMixcloud')}
                        />
                    )}
                </Col>
            </Row>
            {uploadProgress !== null && (
                <Row right style={{ marginTop: 24 }}>
                    <TeritaryButton type="button" onClick={onCancel}>
                        Cancel
                    </TeritaryButton>
                    <SmartButton
                        level="primary"
                        disabled={submitting || uploading || uploadError}
                        loading={submitting}
                        onClick={updateSound}
                        type="submit"
                    >
                        {uploading ? 'Uploading...' : sound.id ? 'Update sound' : 'Add sound'}
                    </SmartButton>
                </Row>
            )}
            <ErrorMessageApollo error={details || error} />
        </form>
    );
};

const HiddenFileInput = styled.input.attrs({ type: 'file' })`
    width: 0.1px;
    height: 0.1px;
    opacity: 0;
    overflow: hidden;
    position: absolute;
    z-index: -1;
`;

const AlbumWrapper = styled.div`
    margin-right: 20px;
    margin-bottom: 24px;
    position: relative;
`;

const AlbumText = styled(SecondaryButton)`
    position: absolute;
    bottom: 1em;
    left: 50%;
    transform: translate(-50%);
    pointer-events: none;
`;
const AlbumCover = styled(GracefullImage)`
    border-radius: 3px;
    width: 220px;
    min-width: 220px;
    height: 220px;
    object-fit: cover;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
    cursor: pointer;
`;
const CoverPicture = ({ url, onChange, imageFile }) => {
    const [src, setSrc] = useState(url);
    const input = useRef();

    const onFileChosen = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();

            reader.onload = function (e) {
                setSrc(e.target.result);
            };
            reader.readAsDataURL(file);
            onChange && onChange(file);
        }
    };

    // if image file
    useEffect(() => {
        if (imageFile) {
            const reader = new FileReader();

            reader.onload = function (e) {
                setSrc(e.target.result);
            };
            reader.readAsDataURL(imageFile);
            onChange && onChange(imageFile);
        }
    }, [imageFile, onChange]);

    return (
        <AlbumWrapper>
            <AlbumCover src={src} onClick={(e) => input.current.click(e)} />
            <HiddenFileInput ref={input} onChange={onFileChosen} accept="image/*" />
            <AlbumText>Change image</AlbumText>
        </AlbumWrapper>
    );
};

export default AddSound;
