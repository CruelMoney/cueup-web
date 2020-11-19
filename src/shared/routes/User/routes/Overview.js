import React from 'react';
import styled from 'styled-components';
import { Link, NavLink } from 'react-router-dom';
import { Icon, InlineIcon } from '@iconify/react';
import addCircleIcon from '@iconify/icons-ion/add-circle';
import chatIcon from '@iconify/icons-ion/chatbubbles';
import phoneIcon from '@iconify/icons-ion/call';

import { useLocation } from 'react-router';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import Rating from 'components/common/RatingNew';
import useTranslate from 'components/hooks/useTranslate';
import { Title, Citation, Cite, Body } from '../../../components/Text';
import ReadMoreExpander from '../../../components/ReadMoreExpander';
import {
    Col,
    Row,
    ReadMore,
    Show,
    InfoBox,
    Hr,
    RowMobileCol,
    SecondaryButton,
} from '../../../components/Blocks';
import Map from '../../../components/common/Map';
import QuotationMarkIcon from '../../../components/graphics/Quotes';
import { PolicyDisplayer } from '../../Settings/components/CancelationPolicyPopup';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import GracefullImage from '../../../components/GracefullImage';
import GracefullVideo from '../../../components/GracefullVideo';
import DownloadAppPopup from '../components/DownloadAppPopup';
import EditButton from '../components/EditButton';
import { UserInfo } from '../components/Common';
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
    border-right: 2px solid #e9ecf0;
    @media only screen and (max-width: 990px) {
        border: none;
    }
`;

const HalfColRight = styled(HalfCol)`
    border-left: 2px solid #e9ecf0;
    margin-left: -2px;
    @media only screen and (max-width: 990px) {
        display: none;
    }
`;

const Item = styled.div`
    position: relative;
    border-bottom: 2px solid #e9ecf0;
    padding: 42px;
    @media only screen and (max-width: 768px) {
        border-bottom: none;
    }
`;

const LeftItem = styled(Item)`
    position: relative;
    padding: 42px 42px 42px 0;
    @media only screen and (max-width: 768px) {
        padding: 42px 0px 42px 0px;
        border-bottom: none;
    }
`;

const SoundLayout = styled(Item)`
    padding: 0 0px 42px 42px;

    @media only screen and (max-width: 990px) {
        padding: 42px 0px 18px 0px;
    }
    @media only screen and (max-width: 768px) {
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
    @media only screen and (max-width: 768px) {
        padding: 42px 0px 18px 0px;
        margin-right: -15px;
    }
`;

const Genre = styled(InfoBox)`
    margin-left: 24px;
    margin-bottom: 24px;
    margin-right: 0px;
    word-break: break-all;
    @media only screen and (max-width: 990px) {
        margin-left: 0px;
        margin-right: 24px;
    }
    @media only screen and (max-width: 768px) {
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

const Bio = ({ bio, firstName, style, isOwn, to, permalink }) => {
    const { search } = useLocation();
    const { translate } = useTranslate();

    return (
        <LeftItem style={{ paddingTop: 0, ...style }}>
            <Title>About {firstName}</Title>
            <ReadMoreExpander content={bio || '...'} />
            {isOwn && (
                <EditButton title="Edit bio" to={to} style={{ marginTop: 0 }}>
                    Edit
                </EditButton>
            )}

            <RowMobileCol>
                <NavLink
                    to={{
                        pathname: translate(appRoutes.userBook).replace(':permalink', permalink),
                        search,
                        state: {
                            buttonLabel: 'Message',
                        },
                    }}
                    style={{ flex: 1 }}
                >
                    <SecondaryButton style={{ width: '100%', minHeight: 40 }}>
                        <InlineIcon
                            icon={chatIcon}
                            style={{ position: 'absolute', left: '1em', top: '0.75em' }}
                        />
                        Message
                    </SecondaryButton>
                </NavLink>
                <NavLink
                    style={{ flex: 1 }}
                    to={{
                        pathname: translate(appRoutes.userBook).replace(':permalink', permalink),
                        search,
                        state: {
                            buttonLabel: 'Request call',
                        },
                    }}
                >
                    <SecondaryButton style={{ width: '100%', minHeight: 40 }}>
                        <InlineIcon
                            icon={phoneIcon}
                            style={{ position: 'absolute', left: '1em', top: '0.75em' }}
                        />
                        Request a call
                    </SecondaryButton>
                </NavLink>
            </RowMobileCol>

            <Show maxWidth="990px">
                <Hr style={{ marginTop: 30 }} />
            </Show>
        </LeftItem>
    );
};

const Genres = ({ genres = [], style, isOwn, to }) => (
    <GenresLayout style={style}>
        {isOwn && (
            <EditButton to={to} title="Edit genres" style={{ marginRight: 0, marginTop: 0 }} />
        )}
        {genres.map((g) => (
            <Genre key={g}>{g}</Genre>
        ))}
    </GenresLayout>
);

const HighlightedSound = ({ user }) => {
    const sounds = user?.sounds?.edges || [];
    const hasSounds = sounds.length > 0;

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
        sound = sounds[0];
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

const Review = ({ isOwn, reviewsCount, highlightedReview }) => {
    const { content, author, citation, rating } = highlightedReview;

    if (!content) {
        return null;
    }

    return (
        <LeftItem>
            <Title>Highlighted Review</Title>

            <Row middle style={{ marginTop: '36px' }}>
                <Col style={{ width: '100%' }}>
                    <Row between middle style={{ marginBottom: '9px' }}>
                        <QuotationMarkIcon />
                        <Cite>
                            {author ? author.userMetadata.firstName : citation?.slice(0, 30)}
                        </Cite>
                        <div style={{ flex: 1 }} />

                        {rating && <Rating rating={rating} disabled />}
                    </Row>
                    <Citation>
                        {content.length > 130 ? content.slice(0, 127) + '...' : content}
                    </Citation>
                </Col>
            </Row>

            <Link to={'reviews'}>
                <ReadMore style={{ marginTop: '24px' }}>{reviewsCount} REVIEWS MORE</ReadMore>
            </Link>
        </LeftItem>
    );
};
const MapArea = ({ playingLocation, isOwn, to }) => {
    if (!playingLocation) {
        return null;
    }
    return (
        <Square
            style={{
                pointerEvents: isOwn ? 'auto' : 'none',
            }}
        >
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
            {isOwn && <EditButtonOverlay to={to}>Edit</EditButtonOverlay>}
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
    @media only screen and (max-width: 768px) {
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
        renderItems = [...photos].sort((a, b) => a.orderBy - b.orderBy);
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
                <Icon
                    icon={addCircleIcon}
                    color={'#50e3c2'}
                    style={{ fontSize: '30px', marginTop: 12 }}
                />
            </LeftItem>
        </Link>
    );
};

const MobileExpandWidth = styled.div`
    margin-left: -15px;
    margin-right: -15px;
`;

const Overview = ({ user, loading, location, history }) => {
    const { t } = useTranslate();
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
        permalink,
    } = user;
    const { firstName, bio } = userMetadata || {};
    const { cancelationPolicy } = userSettings || {};

    const showPhotosArea = media?.edges.length > 0 || isOwn;
    const showSelectedSound = sounds?.pageInfo.totalDocs > 0 || isOwn;

    const bioStyle = showPhotosArea ? { borderBottom: 'none' } : {};
    const genresStyle = { paddingTop: showSelectedSound ? '42px' : '0px' };

    const settingsRoute = t(appRoutes.userSettings);

    return (
        <ColumnLayout>
            <DownloadAppPopup isActive={appPopup} close={onModalClose} />
            <Row>
                <HalfColLeft>
                    <Show maxWidth="990px">
                        <Col>
                            <UserInfo user={user} />
                            <Hr style={{ marginTop: 15, marginBottom: 30 }} />
                        </Col>
                    </Show>
                    <Bio
                        isOwn={isOwn}
                        firstName={firstName}
                        bio={bio}
                        style={bioStyle}
                        to={settingsRoute + '?modal=bio'}
                        permalink={permalink}
                    />
                    {showSelectedSound && (
                        <Show maxWidth="990px">
                            <HighlightedSound user={user} />
                            <Hr style={{ marginTop: 30 }} />
                        </Show>
                    )}
                    <Show maxWidth="990px">
                        <Genres
                            genres={genres}
                            style={genresStyle}
                            isOwn={isOwn}
                            to={settingsRoute + '?modal=genres'}
                        />
                        <Hr />
                    </Show>
                    {showPhotosArea && <PhotosArea {...user} />}
                    {highlightedReview ? (
                        <Review
                            isOwn={isOwn}
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
                        <Show maxWidth="990px">
                            <MobileExpandWidth>
                                <Hr />
                                <MapArea
                                    playingLocation={playingLocation}
                                    isOwn={isOwn}
                                    to={settingsRoute + '?modal=location'}
                                />
                                <Hr />
                            </MobileExpandWidth>
                        </Show>
                    )}
                    {user.isDj && (
                        <LeftItem>
                            <Title>Cancelation Policy</Title>
                            <PolicyDisplayer cancelationPolicy={cancelationPolicy} />
                            {isOwn && (
                                <EditButton to={settingsRoute + '?modal=cancelationPolicy'} />
                            )}
                        </LeftItem>
                    )}
                </HalfColLeft>
                {user.isDj && (
                    <HalfColRight>
                        {showSelectedSound && <HighlightedSound user={user} />}
                        <Genres
                            genres={genres}
                            style={genresStyle}
                            isOwn={isOwn}
                            to={settingsRoute + '?modal=genres'}
                        />
                        <MapArea
                            playingLocation={playingLocation}
                            isOwn={isOwn}
                            to={settingsRoute + '?modal=location'}
                        />
                    </HalfColRight>
                )}
            </Row>
        </ColumnLayout>
    );
};

export default Overview;
