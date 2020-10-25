import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import styled from 'styled-components';
import * as Sentry from '@sentry/react';
import { useHistory, useRouteMatch } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useForm } from 'components/hooks/useForm';
import useConnectSoundCloud from 'components/hooks/useConnectSoundcloud';
import DateInput from 'components/DateInput';
import useConnectMixcloud from 'components/hooks/useConnectMixcloud';
import { ME } from 'components/gql';
import {
    Input,
    InputRow,
    InputLabel,
    Checkbox,
    ProFeature,
} from '../../../../components/FormComponents';
import { Title, Body, BodySmall, InlineLink } from '../../../../components/Text';
import {
    Row,
    TeritaryButton,
    SmartButton,
    Col,
    SecondaryButton,
    RowWrap,
    PrimaryButton,
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
    const { sound, soundCloudConnected, mixcloudConnected, userId } = props;
    const [uploadProgress, setuploadProgress] = useState(sound ? 1 : null);
    const abortUpload = useRef();
    const [file, setFile] = useState();
    const [fileId, setFileId] = useState();
    const [addToSoundCloud, setAddToSoundcloud] = useState(false);
    const [addToMixcloud, setAddToMixcloud] = useState(false);

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
                    mixcloudConnected={mixcloudConnected}
                    setAddToMixcloud={setAddToMixcloud}
                />
            ) : (
                <DataForm
                    {...props}
                    sound={{
                        ...metadata.common,
                        tags: metadata.common && metadata.common.genre,
                        addToSoundCloud,
                        addToMixcloud,
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

const FileChooser = ({
    onChange,
    soundCloudConnected,
    mixcloudConnected,
    userId,
    setAddToSoundcloud,
    setAddToMixcloud,
}) => {
    const [connect, { loading }] = useConnectSoundCloud({ userId, soundCloudConnected });
    const [connectMixcloud, { loading: loadingMixcloud }] = useConnectMixcloud({
        userId,
        mixcloudConnected,
    });

    return (
        <Col middle>
            <Body style={{ textAlign: 'center', maxWidth: '500px' }}>
                For the best result upload in wav or m4a. <br />
                The file will be optimised for streaming at 256 kbps.
            </Body>
            <Col style={{ margin: '24px 0 6px 0' }}>
                <Checkbox
                    label={'Add to your Soundcloud'}
                    onChange={(checked) => {
                        if (checked && !soundCloudConnected && !loading) {
                            connect();
                        }
                        setAddToSoundcloud(checked);
                    }}
                />

                <Checkbox
                    label={'Add to your Mixcloud'}
                    onChange={(checked) => {
                        if (checked && !mixcloudConnected && !loadingMixcloud) {
                            connectMixcloud();
                        }
                        setAddToMixcloud(checked);
                    }}
                />
            </Col>
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
                    addToMixcloud: form.addToMixcloud,
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
    width: 220px;
    min-width: 220px;
    height: 220px;
    position: relative;
    background-color: #eff2f5;
    border-radius: 3px;
    overflow: hidden;
    cursor: pointer;
`;

const AlbumText = styled(SecondaryButton)`
    position: absolute;
    bottom: 1em;
    left: 50%;
    transform: translate(-50%);
    pointer-events: none;
`;
const AlbumCover = styled(GracefullImage)`
    height: 100%;
    width: 100%;
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
        <AlbumWrapper onClick={(e) => input.current.click(e)}>
            <AlbumCover src={src} />
            <HiddenFileInput ref={input} onChange={onFileChosen} accept="image/*" />
            <AlbumText>Change image</AlbumText>
        </AlbumWrapper>
    );
};

const LimitReached = () => {
    const match = useRouteMatch();

    return (
        <Col center middle style={{ maxWidth: 350, margin: 'auto', textAlign: 'center' }}>
            <ProFeature />
            <h2>You've reached the upload limit for free members</h2>
            <Body style={{ marginBottom: 24, maxWidth: 300 }}>
                Go Pro to enjoy unlimited uploads and many other benefits.
            </Body>
            <NavLink to={match.url + '/get-pro'}>
                <PrimaryButton>Go Pro</PrimaryButton>
            </NavLink>
        </Col>
    );
};

const DataWrapper = (props) => {
    const { data } = useQuery(USER_SOUNDS, {
        variables: {
            userId: props?.userId,
        },
    });

    const { data: meData } = useQuery(ME);

    const uploadedSoundsCount = data?.userSounds?.edges.filter((s) => !s.source).length;
    const hasReachedLimit = uploadedSoundsCount >= 2 && !meData?.me?.appMetadata?.isPro;

    if (hasReachedLimit) {
        return <LimitReached />;
    }

    return <AddSound {...props} />;
};

export default DataWrapper;
