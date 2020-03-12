import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { useQuery, useMutation } from 'react-apollo';
import RemoveButton from 'react-ionicons/lib/MdRemoveCircle';
import { useInView } from 'react-intersection-observer';
import { useConnectInstagram } from 'components/hooks/useConnectInstagram';
import GracefullImage from '../../../components/GracefullImage';
import { USER_PHOTOS, ADD_MEDIA, DELETE_MEDIA, UPDATE_PHOTOS_ORDER, USER } from '../gql';
import EmptyPage from '../../../components/common/EmptyPage';
import { getErrorMessage } from '../../../components/common/ErrorMessageApollo';
import { SecondaryButton, Col, TeritaryButton, LoadingIndicator } from '../../../components/Blocks';
import { ButtonFileInput } from '../../../components/FormComponents';
import { ImageCompressor } from '../../../utils/ImageCompressor';
import GracefullVideo from '../../../components/GracefullVideo';
import ReorderGrid from '../components/ReorderGrid';
import SavingIndicator from '../../../components/SavingIndicator';
import InstagramLogo from '../../../assets/InstagramLogo';
import { BodySmall, Body } from '../../../components/Text';

const LIMIT = 6;

const RemoveImageWrapper = styled.div`
    opacity: 0;
    z-index: 1;
    background: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 1em;
`;

const ImageGrid = styled.ul`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 3px;
    list-style: none;
    @media only screen and (max-width: 425px) {
        grid-gap: 1px;
    }
`;

const Cell = styled.div`
    background: #eff2f5;
    position: relative;
    overflow: hidden;
    ${({ css }) => css}
    > * {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    :before {
        content: '';
        display: block;
        padding-top: 100%;
    }
    :hover ${RemoveImageWrapper} {
        opacity: 1;
    }
    :hover caption {
        display: flex;
    }
`;

const Backdrop = styled.div`
    top: 0.5em;
    right: 0.5em;
    box-shadow: 0 0 10px 0px rgba(0, 0, 0, 0.72);
    background: rgba(0, 0, 0, 0.3);
    z-index: 2;
    width: auto;
    height: auto;
    left: initial;
    bottom: initial;
    color: white;
    display: flex;
    border-radius: 50%;
    svg {
        margin: 4px;
        fill: #fff;
    }
    @media only screen and (max-width: 425px) {
        top: 0.3em;
        right: 0.3em;
    }
`;
const Backdrop2 = styled.caption`
    z-index: 2;
    display: none;
    top: auto;
    width: auto;
    height: auto;
    border-radius: 0;
    bottom: 0;
    left: 0;
    padding: 1em;
    right: 0;
    box-shadow: 0px 0px 20px 0px rgba(0, 0, 0, 0.72);
    background: rgba(0, 0, 0, 0.4);
    > p {
        font-weight: 600;
        color: white;
        margin-bottom: 0;
    }
`;

const InstaIndicator = () => (
    <Backdrop>
        <InstagramLogo size={'18px'} />
    </Backdrop>
);

const InstaCaption = ({ children }) => (
    <Backdrop2>
        <BodySmall>{children}</BodySmall>
    </Backdrop2>
);
const imgPlaceholders = [
    { path: null, type: 'IMAGE' },
    { path: null, type: 'IMAGE' },
    { path: null, type: 'IMAGE' },
    { path: null, type: 'IMAGE' },
    { path: null, type: 'IMAGE' },
    { path: null, type: 'IMAGE' },
];

const Photos = ({ user, loading }) => {
    const [uploadError, setUploadError] = useState();
    const [saving, setSaving] = useState([]);
    const [saveMutation] = useMutation(ADD_MEDIA);
    const [updateMutation] = useMutation(UPDATE_PHOTOS_ORDER);
    const [deleteMutation] = useMutation(DELETE_MEDIA);
    const [ref, inView] = useInView({ rootMargin: '0px' });
    const [lastFetchedPage, setLastFetchedPage] = useState(1);

    const { data, error: photosError, loading: loadingPhotos, fetchMore } = useQuery(USER_PHOTOS, {
        skip: loading,
        variables: {
            id: user && user.id,
            pagination: {
                limit: LIMIT,
                page: 1,
                orderBy: 'ORDER_KEY',
            },
        },
    });

    const error = uploadError || photosError;

    const media = loading || loadingPhotos ? imgPlaceholders : data.user.media.edges;

    const hasNextPage = loading || loadingPhotos ? false : data.user.media.pageInfo.hasNextPage;

    const nextPage = loading || loadingPhotos ? 1 : data.user.media.pageInfo.nextPage;

    const userId = user && user.id;

    const { instagramUsername, instagramStatus } = data?.user?.appMetadata || {};

    const loadMore = useCallback(
        (page, userId) => {
            fetchMore({
                variables: {
                    id: userId,
                    pagination: {
                        limit: LIMIT,
                        page,
                        orderBy: 'ORDER_KEY',
                    },
                },

                updateQuery: (prev, { fetchMoreResult }) => {
                    if (!fetchMoreResult) {
                        return prev;
                    }

                    return {
                        ...prev,
                        user: {
                            ...prev.user,
                            media: {
                                ...fetchMoreResult.user.media,
                                edges: [
                                    ...prev.user.media.edges,
                                    ...fetchMoreResult.user.media.edges,
                                ],
                            },
                        },
                    };
                },
            });
        },
        [fetchMore]
    );

    useEffect(() => {
        if (inView && hasNextPage && lastFetchedPage !== nextPage) {
            setLastFetchedPage(nextPage);
            loadMore(nextPage, userId);
        }
    }, [inView, hasNextPage, loadMore, nextPage, userId, lastFetchedPage]);

    if (error) {
        return <EmptyPage title={'Error'} message={getErrorMessage(error)} />;
    }

    const saveFile = async (file, idGuess) => {
        try {
            setSaving((ff) => [...ff, file]);

            let fileToSave = file;
            let previewPath = null;
            const type = file.type.split('/')[0].toUpperCase();

            if (type === 'IMAGE') {
                const { imageData: base64 } = await ImageCompressor(file, true, {
                    maxWidth: 1000,
                    maxHeight: 1000,
                });
                fileToSave = file;
                previewPath = base64;
            } else {
                previewPath = URL.createObjectURL(file);
            }

            await saveMutation({
                variables: {
                    file: fileToSave,
                },
                optimisticResponse: {
                    __typename: 'Mutation',
                    addMedia: {
                        __typename: 'Media',
                        id: idGuess,
                        path: previewPath,
                        type,
                        orderBy: null,
                        data: {},
                        name: '',
                    },
                },
                update: (proxy, { data: { addMedia } }) => {
                    const data = proxy.readQuery({
                        query: USER_PHOTOS,
                        variables: {
                            id: userId,
                            pagination: {
                                limit: LIMIT,
                                page: 1,
                                orderBy: 'ORDER_KEY',
                            },
                        },
                    });

                    proxy.writeQuery({
                        query: USER_PHOTOS,
                        variables: {
                            id: userId,
                            pagination: {
                                limit: LIMIT,
                                page: 1,
                                orderBy: 'ORDER_KEY',
                            },
                        },
                        data: {
                            user: {
                                ...data.user,
                                media: {
                                    ...data.user.media,
                                    edges: [addMedia, ...data.user.media.edges],
                                },
                            },
                        },
                    });
                    const userData = proxy.readQuery({
                        query: USER,
                        variables: {
                            permalink: user.permalink,
                        },
                    });

                    proxy.writeQuery({
                        query: USER,
                        variables: {
                            permalink: user.permalink,
                        },

                        data: {
                            user: {
                                ...userData.user,
                                media: {
                                    ...userData.user.media,
                                    edges: [addMedia, ...userData.user.media.edges].slice(0, 5),
                                },
                            },
                        },
                    });
                },
            });
        } catch (error) {
            setUploadError(error);
        } finally {
            setSaving((ff) => ff.filter((f) => f !== file));
        }
    };

    const deleteFile = async (id) => {
        try {
            setSaving((ff) => [...ff, id]);
            await deleteMutation({
                variables: {
                    id,
                },
                optimisticResponse: {
                    __typename: 'Mutation',
                    deleteMedia: true,
                },
                update: (proxy) => {
                    const data = proxy.readQuery({
                        query: USER_PHOTOS,
                        variables: {
                            id: userId,
                            pagination: {
                                limit: LIMIT,
                                page: 1,
                                orderBy: 'ORDER_KEY',
                            },
                        },
                    });
                    proxy.writeQuery({
                        query: USER_PHOTOS,
                        variables: {
                            id: userId,
                            pagination: {
                                limit: LIMIT,
                                page: 1,
                                orderBy: 'ORDER_KEY',
                            },
                        },
                        data: {
                            user: {
                                ...data.user,
                                media: {
                                    ...data.user.media,
                                    edges: data.user.media.edges.filter((e) => e.id !== id),
                                },
                            },
                        },
                    });
                },
            });
        } catch (error) {
            setUploadError(error);
        } finally {
            setSaving((ff) => ff.filter((f) => f !== id));
        }
    };

    const uploadFiles = async (files) => {
        await Promise.all([...files].map((file, idx) => saveFile(file, media.length + idx + 1)));
    };

    const { isOwn } = user || {};

    const renderMedia = media.filter((img) => ['IMAGE', 'VIDEO'].includes(img.type));

    if (renderMedia.length === 0) {
        return (
            <>
                <EmptyPage
                    title="No Photos or Videos"
                    message={isOwn ? <EmptyCTA user={user} uploadFiles={uploadFiles} /> : ''}
                >
                    <Body style={{ marginTop: 24 }}>{instagramStatus}</Body>
                </EmptyPage>
                <SavingIndicator loading={saving.length > 0} message={'Uploading'} />
            </>
        );
    }

    const updateFilesOrder = async (items) => {
        const updates = items.map((i) => ({ id: i.id, orderBy: i.orderBy }));
        await updateMutation({ variables: { updates } });
    };

    return (
        <Wrapper>
            <Images
                renderMedia={renderMedia}
                isOwn={isOwn}
                deleteFile={deleteFile}
                updateFilesOrder={updateFilesOrder}
            >
                {hasNextPage && (
                    <Cell ref={ref}>
                        <LoadMoreButtonWrapper>
                            <TeritaryButton>Load more</TeritaryButton>
                        </LoadMoreButtonWrapper>
                    </Cell>
                )}
            </Images>

            <SavingIndicator loading={saving.length > 0} message={'Uploading'} />
            {isOwn && (
                <Col style={{ marginTop: '30px', width: '250px' }}>
                    <ButtonFileInput
                        accept="image/*,video/*"
                        onChange={(e) => uploadFiles(e.target.files)}
                        multiple
                    >
                        Add photos or videos
                    </ButtonFileInput>
                </Col>
            )}
        </Wrapper>
    );
};

const LoadMoreButtonWrapper = styled.div`
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
`;

const RemoveImageButton = ({ deleteImage }) => {
    return (
        <RemoveImageWrapper>
            <RemoveButton
                onClick={deleteImage}
                color="#fff"
                style={{ cursor: 'pointer' }}
                fontSize="36px"
            />
        </RemoveImageWrapper>
    );
};

const getCellStyle = (idx) => {
    const pos = idx % 12;
    const currentRepeat = Math.floor(idx / 12);
    let currentRow = pos < 4 ? 1 : 4;

    currentRow += currentRepeat * 6;

    // large left
    if (pos === 0) {
        return {
            gridColumn: '1 / span 2',
            gridRow: `${currentRow} / span 2`,
        };
    }
    // large right
    if (pos === 8) {
        return {
            gridColumn: '2 / span 2',
            gridRow: `${currentRow} / span 2`,
        };
    }

    return {};
};

const Images = ({ renderMedia, isOwn, deleteFile, updateFilesOrder, children }) => {
    const imgData = renderMedia
        .sort((a, b) => a.orderBy - b.orderBy)
        .map((file, idx) => ({
            id: file.id || idx,
            content: (
                <Cell key={file.id || idx} style={getCellStyle(idx)}>
                    {file.data && file.data.instagram && <InstaIndicator />}
                    {file.data && file.data.instagram && <InstaCaption>{file.name}</InstaCaption>}
                    {file.type === 'IMAGE' ? (
                        <GracefullImage src={file.path} animate={!isOwn} alt={file.name} />
                    ) : (
                        <GracefullVideo
                            src={file.path}
                            animate={!isOwn}
                            loop
                            autoPlay
                            muted
                            playsInline
                        />
                    )}
                    {isOwn && file.id && (
                        <RemoveImageButton deleteImage={() => deleteFile(file.id)} />
                    )}
                </Cell>
            ),
        }));

    if (!isOwn) {
        return (
            <ImageGrid>
                {imgData.map((item) => item.content)}
                {children}
            </ImageGrid>
        );
    }

    return (
        <ReorderGrid
            key={imgData
                .map((d) => d.id)
                .sort()
                .toString()}
            onOrderChanged={updateFilesOrder}
            Wrapper={ImageGrid}
            data={imgData}
        >
            {children}
        </ReorderGrid>
    );
};

const EmptyCTA = ({ uploadFiles }) => {
    return (
        <>
            <Col
                style={{
                    marginTop: '30px',
                    height: '100px',
                    justifyContent: 'space-between',
                }}
            >
                <ButtonFileInput
                    accept="image/*,video/*"
                    onChange={(e) => uploadFiles(e.target.files)}
                    multiple
                >
                    Add photos or videos
                </ButtonFileInput>
                <ConnectInstaButton />
            </Col>
        </>
    );
};

const ConnectInstaButton = () => {
    const [connect, { loading }] = useConnectInstagram();

    return (
        <SecondaryButton disabled={loading} onClick={connect}>
            Connect Instagram
            {loading && <LoadingIndicator style={{ marginLeft: '5px' }} />}
        </SecondaryButton>
    );
};

const Wrapper = styled.div`
    @media only screen and (max-width: 425px) {
        margin-top: -41px;
        width: 100vw;
        margin-left: -15px;
        margin-right: -15px;
    }
`;

export default Photos;
