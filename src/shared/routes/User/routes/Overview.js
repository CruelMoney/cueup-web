import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import { Icon, InlineIcon } from '@iconify/react';
import addCircleIcon from '@iconify/icons-ion/add-circle';

import { userRoutes } from 'constants/locales/appRoutes';
import { Title, Citation, Cite, Body } from '../../../components/Text';
import ReadMoreExpander from '../../../components/ReadMoreExpander';
import {
    Col,
    Row,
    ReadMore,
    Show,
    InfoBox,
    SecondaryButton,
    TeritaryButton,
} from '../../../components/Blocks';
import Map from '../../../components/common/Map';
import QuotationMarkIcon from '../../../components/graphics/Quotes';
import { PolicyDisplayer } from '../components/CancelationPolicyPopup';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import GracefullImage from '../../../components/GracefullImage';
import GracefullVideo from '../../../components/GracefullVideo';
import DownloadAppPopup from '../components/DownloadAppPopup';
import Sound from './Sounds/Sound';

const ColumnLayout = styled.section`
    width: 100%;
    z-index: 0;
`;

const HalfCol = styled(Col)`
    flex: 1;
    width: 100%;
`;

const HalfColLeft = styled(HalfCol)`
    border-right: 1px solid #e9ecf0;
    @media only screen and (max-width: 990px) {
        border: none;
    }
`;

const HalfColRight = styled(HalfCol)`
    @media only screen and (max-width: 990px) {
        display: none;
    }
`;

const Item = styled.div`
    position: relative;
    border-bottom: 1px solid #e9ecf0;
    padding: 42px;
`;

const LeftItem = styled(Item)`
    position: relative;
    padding: 42px 42px 42px 0;
    @media only screen and (max-width: 425px) {
        padding: 42px 0px 42px 0px;
        border-bottom: none;
    }
`;

const SoundLayout = styled(Item)`
    padding: 0 0px 42px 42px;

    @media only screen and (max-width: 990px) {
        padding: 42px 0px 18px 0px;
    }
    @media only screen and (max-width: 425px) {
        padding: 42px 0px 0px 0px;
        margin-top: -42px;
        border-bottom: none;
    }
`;

const GenresLayout = styled(Item)`
    padding: 0px 0px 18px 18px;
    min-height: 275px;
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    @media only screen and (max-width: 990px) {
        padding: 42px 0px 18px 0px;
    }
    @media only screen and (max-width: 425px) {
        padding: 42px 0px 18px 0px;
        margin-right: -15px;
    }
`;

const Genre = styled(InfoBox)`
    margin-left: 24px;
    margin-bottom: 24px;
    margin-right: 0px;

    @media only screen and (max-width: 990px) {
        margin-left: 0px;
        margin-right: 24px;
    }
    @media only screen and (max-width: 425px) {
        margin-right: 15px;
    }
`;

const Square = styled.div`
    position: relative;
    width: 100%;
    &:after {
        content: '';
        padding-top: 100%;
        display: block;
    }
    > * {
        position: absolute;
        left: 0;
        top: 0;
        height: 100% !important;
        width: 100%;
        max-height: 100%;
    }
`;

const EditOverlay = styled.div`
    cursor: pointer;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.8);
    display: flex;
    justify-content: center;
    align-items: center;
    opacity: 0;
    transition: opacity 100ms ease-out;
    z-index: 2;
    &:hover {
        opacity: 1;
    }
`;

const EditButtonOverlay = ({ to, children }) => {
    return (
        <Link to={to}>
            <EditOverlay>
                <ReadMore white>{children}</ReadMore>
            </EditOverlay>
        </Link>
    );
};

const Bio = ({ bio, firstName, style, isOwn }) => {
    return (
        <LeftItem style={{ paddingTop: 0, ...style }}>
            <Title>About {firstName}</Title>
            <ReadMoreExpander content={bio || 'Nothing here yet'} />
            {/* {isOwn && <EditButtonOverlay to={'settings?modal=bio'}>Edit</EditButtonOverlay>} */}
        </LeftItem>
    );
};

const Genres = ({ genres, style, isOwn }) => (
    <GenresLayout style={style}>
        <EditButton />
        {genres.map((g) => (
            <Genre key={g}>{g}</Genre>
        ))}
        {isOwn && <EditButtonOverlay to={'settings?modal=genres'}>Edit</EditButtonOverlay>}
    </GenresLayout>
);

const HighlightedSound = ({ user }) => {
    const hasSounds = user.sounds.edges.length > 0;

    // placeholder
    let sound = {
        title: 'Example sound',
        tags: ['TAGS', 'GENRE'],
        duration: 3600,
        demo: true,
        file: {
            path: '',
        },
        samples: [],
    };

    if (hasSounds) {
        sound = user.sounds.edges[0];
    }

    return (
        <SoundLayout>
            <Sound {...sound} small />
            <Link to={'sounds'}>
                {hasSounds ? (
                    <ReadMore>{user.sounds.pageInfo.totalDocs} SOUNDS MORE</ReadMore>
                ) : (
                    <ReadMore>ADD TRACKS OR MIXTAPES</ReadMore>
                )}
            </Link>
        </SoundLayout>
    );
};

const Review = ({ reviewsCount, highlightedReview }) => {
    const { content, author, citation } = highlightedReview;

    if (!content) {
        return null;
    }
    return (
        <Link to={'reviews'}>
            <LeftItem>
                <Title>Highlighted Review</Title>

                <Row middle style={{ marginTop: '36px' }}>
                    <Col style={{ width: '100%' }}>
                        <div style={{ marginBottom: '9px' }}>
                            <QuotationMarkIcon />
                            <Cite>{author ? author.userMetadata.firstName : citation}</Cite>
                        </div>
                        <Citation>
                            {content.length > 130 ? content.slice(0, 127) + '...' : content}
                        </Citation>
                    </Col>
                </Row>

                <ReadMore style={{ marginTop: '24px' }}>{reviewsCount} REVIEWS MORE</ReadMore>
            </LeftItem>
        </Link>
    );
};
const MapArea = ({ playingLocation, isOwn }) => {
    if (!playingLocation) {
        return null;
    }
    return (
        <Square>
            <Map
                radius={playingLocation.radius}
                name={'playingLocation'}
                value={{
                    lat: playingLocation.latitude,
                    lng: playingLocation.longitude,
                }}
                height={'100%'}
                editable={false}
                color={'#50E3C2'}
                mapOptions={{
                    zoomControl: false,
                    fullscreenControl: false,
                }}
            />
            {isOwn && <EditButtonOverlay to={'settings?modal=location'}>Edit</EditButtonOverlay>}
        </Square>
    );
};

const PhotoGridWrapper = styled.section`
    position: relative;
    :after {
        content: '';
        padding-top: 50%;
        display: block;
    }
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
    @media only screen and (max-width: 425px) {
        margin-left: -15px;
        margin-right: -15px;
    }
`;

const PhotoGrid = styled.ul`
    display: grid;
    grid-template-columns: repeat(4, auto);
    grid-template-rows: repeat(2, auto);
    grid-gap: 1px;
    list-style: none;
    margin-bottom: 0;
    margin-top: 0;
    > li {
        background: #eff2f5;
        position: relative;
        overflow: hidden;
        :after {
            content: '';
            padding-top: 100%;
            display: block;
        }
        &:first-child {
            grid-column: 1 / span 2;
            grid-row: 1 / span 2;
        }
        &:last-child:before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            bottom: 0;
            right: 0;
            width: 100%;
            height: 100%;
            background-color: #111111;
            opacity: 0.7;
            z-index: 1;
        }
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
    }
`;

const PhotosArea = ({ media, isOwn }) => {
    const photos = media?.edges || [];
    const pleaseAddItems = isOwn && photos.length === 0;

    let renderItems = [];
    if (pleaseAddItems) {
        renderItems = [
            { path: null, id: 1 },
            { path: null, id: 2 },
            { path: null, id: 3 },
            { path: null, id: 4 },
            { path: null, id: 5 },
        ];
    } else {
        renderItems = photos.sort((a, b) => a.orderBy - b.orderBy);
    }

    return (
        <PhotoGridWrapper>
            <Link to={'photos'}>
                <PhotoGrid>
                    {renderItems.map((m, idx) => (
                        <li key={m.id}>
                            {m.type === 'VIDEO' ? (
                                <GracefullVideo
                                    src={m.path}
                                    loop
                                    autoPlay
                                    muted
                                    playsInline
                                    animate
                                />
                            ) : (
                                <GracefullImage src={m.path} animate />
                            )}
                            {idx === renderItems.length - 1 && (
                                <ReadMore
                                    color="#fff"
                                    style={{
                                        zIndex: 2,
                                        display: 'flex',
                                        flexDirection: 'row',
                                        padding: '12px',
                                        alignItems: 'flex-end',
                                        whiteSpace: 'pre-wrap',
                                        height: '100%',
                                        width: '100%',
                                    }}
                                >
                                    {pleaseAddItems ? (
                                        <span style={{ color: '#fff' }}>ADD PHOTOS</span>
                                    ) : (
                                        <span style={{ color: '#fff' }}>
                                            {media.pageInfo.totalDocs}
                                            {'\n'}
                                            MORE
                                        </span>
                                    )}
                                </ReadMore>
                            )}
                        </li>
                    ))}
                </PhotoGrid>
            </Link>
        </PhotoGridWrapper>
    );
};

const AddBlockPlaceholder = ({ label, directions, to }) => {
    return (
        <Link to={to}>
            <LeftItem>
                <Title>{label}</Title>
                <Body>{directions}</Body>
                <Icon icon={addCircleIcon} color={'#50e3c2'} style={{ fontSize: '30px' }} />
            </LeftItem>
        </Link>
    );
};

const MobileExpandWidth = styled.div`
    margin-left: -15px;
    margin-right: -15px;
`;

const Overview = ({ user, loading, location, history }) => {
    if (loading) {
        return <LoadingPlaceholder2 />;
    }
    const params = new URLSearchParams(location.search);
    const modal = params.get('modal');
    const appPopup = modal === 'app';

    const onModalClose = () => {
        history.replace(location.pathname);
    };

    const {
        userMetadata,
        genres,
        playingLocation,
        userSettings,
        reviews,
        highlightedReview,
        media,
        isOwn,
        sounds,
    } = user;
    const { firstName, bio } = userMetadata;
    const { cancelationPolicy } = userSettings;

    const showPhotosArea = media && (media.edges.length > 0 || isOwn);
    const showSelectedSound = sounds && (sounds.pageInfo.totalDocs > 0 || isOwn);

    const bioStyle = showPhotosArea ? { borderBottom: 'none' } : {};
    const genresStyle = { paddingTop: showSelectedSound ? '42px' : '0px' };

    return (
        <ColumnLayout>
            <DownloadAppPopup isActive={appPopup} close={onModalClose} />
            <Row>
                <HalfColLeft>
                    <Bio isOwn={isOwn} firstName={firstName} bio={bio} style={bioStyle} />
                    {showSelectedSound && (
                        <Show maxWidth="990px">
                            <HighlightedSound user={user} />
                        </Show>
                    )}
                    <Show maxWidth="990px">
                        <Genres genres={genres} style={genresStyle} isOwn={isOwn} />
                    </Show>
                    {showPhotosArea && <PhotosArea {...user} />}
                    {highlightedReview ? (
                        <Review
                            reviewsCount={reviews.pageInfo.totalDocs}
                            highlightedReview={highlightedReview}
                        />
                    ) : user.isOwn && user.isDj ? (
                        <AddBlockPlaceholder
                            to={userRoutes.reviews}
                            label="Add Highlight"
                            directions="Select text with the cursor from a review or testimonial to highlight it here."
                        />
                    ) : null}
                    {user.isDj && (
                        <MobileExpandWidth>
                            <Show maxWidth="990px">
                                <MapArea playingLocation={playingLocation} isOwn={isOwn} />
                            </Show>
                        </MobileExpandWidth>
                    )}
                    {user.isDj && (
                        <LeftItem>
                            <Title>Cancelation Policy</Title>
                            <PolicyDisplayer cancelationPolicy={cancelationPolicy} />
                            {isOwn && (
                                <EditButtonOverlay to={'settings?modal=cancelationPolicy'}>
                                    Edit
                                </EditButtonOverlay>
                            )}
                        </LeftItem>
                    )}
                </HalfColLeft>
                {user.isDj && (
                    <HalfColRight>
                        {showSelectedSound && <HighlightedSound user={user} />}
                        <Genres genres={genres} style={genresStyle} isOwn={isOwn} />

                        <MapArea playingLocation={playingLocation} isOwn={isOwn} />
                    </HalfColRight>
                )}
            </Row>
        </ColumnLayout>
    );
};

const EditButton = () => {
    return <TeritaryButton style={{ position: 'absolute', top: 0, right: 0 }}>Edit</TeritaryButton>;
};

export default Overview;
