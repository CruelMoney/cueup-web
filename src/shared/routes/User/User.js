import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import { Query, useMutation, useQuery } from 'react-apollo';
import queryString from 'query-string';

import moment from 'moment';

import { Icon } from '@iconify/react';
import pinIcon from '@iconify/icons-ion/location-sharp';
import timeIcon from '@iconify/icons-ion/time';
import websiteIcon from '@iconify/icons-ion/globe-outline';
import mailIcon from '@iconify/icons-ion/ios-email';
import phoneIcon from '@iconify/icons-ion/call';
import instagramIcon from '@iconify/icons-ion/logo-instagram-outline';

import soundcloudLogo from '@iconify/icons-simple-icons/soundcloud';
import mixcloudIcon from '@iconify/icons-simple-icons/mixcloud';

import { Helmet } from 'react-helmet-async';
import PayForm from 'components/common/PayForm.js';

import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import ReactComment from 'components/ReactComment';
import Sidebar, { SidebarContent } from '../../components/Sidebar';
import Footer from '../../components/common/Footer';
import { Container, Row, Col, Divider } from '../../components/Blocks';
import ScrollToTop from '../../components/common/ScrollToTop';
import Popup from '../../components/common/Popup';
import Login from '../../components/common/Login';
import { SimpleSharing } from '../../components/common/Sharing-v2';
import { LoadingPlaceholder2 } from '../../components/common/LoadingPlaceholder';

import GracefullImage from '../../components/GracefullImage';
import { SmallHeader, TitleClean } from '../../components/Text';
import { ME } from '../../components/gql';
import SavingIndicator from '../../components/SavingIndicator';
import useLogActivity, { ACTIVITY_TYPES } from '../../components/hooks/useLogActivity';
import BookingButton from './components/BookingButton';
import ProfileProgress from './components/ProfileProgress';
import { Overview, Settings, Reviews, Gigs, Events, Booking, Photos, Sounds } from './routes';

import { USER, UPDATE_USER } from './gql';
import BackToEvent from './components/BackToEvent';
import Header from './components/Header';
import { Stats, MobileBookingButton, IconRow, CertifiedVerified } from './components/Common';
import content from './content.json';

const UserSidebar = ({ user, loading, bookingEnabled, location }) => {
    const { userMetadata = {}, appMetadata = {}, playingLocation, email, userSettings = {} } =
        user || {};
    const {
        experience,
        createdAt,
        certified,
        identityVerified,
        instagramUsername,
        isPro,
        soundCloudUsername,
        soundCloudUrl,
        mixcloudUsername,
        mixcloudUrl,
    } = appMetadata;
    let { followers } = appMetadata;

    if (followers && followers.total < 500) {
        followers = false;
    }

    const { publicDisplay } = userSettings;
    const { website, phone } = userMetadata;

    const memberSince = moment(createdAt).format('MMMM YYYY');

    return (
        <Sidebar
            stickyTop={'-300px'} // height of image
            childrenBelow={
                user && user.isOwn ? (
                    <ProfileProgress user={user} />
                ) : (
                    <SimpleSharing shareUrl={user && `/user/${user.permalink}/overview`} />
                )
            }
        >
            <ProfileImg src={user.picture?.path} animate />

            {loading || !user ? (
                <SidebarContent>
                    <LoadingPlaceholder2 />
                </SidebarContent>
            ) : (
                <SidebarContent>
                    {experience || followers ? (
                        <>
                            <Stats experience={experience} followers={followers} />
                            <Divider />
                        </>
                    ) : null}

                    <SmallHeader
                        style={{ marginBottom: '15px' }}
                    >{`Hi I'm ${userMetadata?.firstName}`}</SmallHeader>

                    <Col
                        style={{
                            alignItems: 'flex-start',
                            marginBottom: '-15px',
                        }}
                    >
                        <IconRow className="iconRow">
                            <Icon
                                icon={timeIcon}
                                color={'#98a4b3'}
                                style={{ marginRight: '15px', fontSize: '24px' }}
                            />
                            Member since {memberSince}
                        </IconRow>
                        {playingLocation && (
                            <IconRow>
                                <Icon
                                    icon={pinIcon}
                                    color={'#98a4b3'}
                                    style={{ marginRight: '15px', fontSize: '24px' }}
                                />
                                {playingLocation.name}
                            </IconRow>
                        )}
                        <CertifiedVerified
                            certified={certified}
                            identityVerified={identityVerified}
                        />
                        {instagramUsername && isPro && publicDisplay?.INSTAGRAM.public && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer ugc"
                                href={'https://instagram.com/' + instagramUsername}
                                title="Visit Instagram profile"
                            >
                                <IconRow>
                                    <Icon
                                        icon={instagramIcon}
                                        color={'#98a4b3'}
                                        style={{ marginRight: '15px', fontSize: '24px' }}
                                    />
                                    {instagramUsername}
                                </IconRow>
                            </a>
                        )}

                        {soundCloudUsername && isPro && publicDisplay?.SOUNDCLOUD.public && (
                            <a
                                href={`${soundCloudUrl}?ref=cueup`}
                                target="_blank"
                                rel="noopener noreferrer ugc"
                                title="Visit SoundCloud profile"
                            >
                                <IconRow>
                                    <Icon
                                        icon={soundcloudLogo}
                                        color={'#98a4b3'}
                                        style={{ marginRight: '15px', fontSize: '24px' }}
                                    />
                                    {soundCloudUsername}
                                </IconRow>
                            </a>
                        )}

                        {mixcloudUrl && isPro && publicDisplay?.MIXCLOUD.public && (
                            <a
                                href={`${mixcloudUrl}?ref=cueup`}
                                target="_blank"
                                rel="noopener noreferrer ugc"
                                title="Visit Mixcloud profile"
                            >
                                <IconRow>
                                    <Icon
                                        icon={mixcloudIcon}
                                        color={'#98a4b3'}
                                        style={{ marginRight: '15px', fontSize: '24px' }}
                                    />
                                    {mixcloudUsername}
                                </IconRow>
                            </a>
                        )}
                        {website && isPro && publicDisplay?.WEBSITE.public && (
                            <a
                                target="_blank"
                                rel="noopener noreferrer nofollow"
                                href={website}
                                title="Visit website"
                            >
                                <ReactComment comment="HEY YOU! Want nofollow removed from your website-link? Message me on chris@cueup.io" />
                                <IconRow>
                                    <Icon
                                        icon={websiteIcon}
                                        color={'#98a4b3'}
                                        style={{ marginRight: '15px', fontSize: '24px' }}
                                    />
                                    {new URL(website).hostname}
                                </IconRow>
                            </a>
                        )}
                        {email && isPro && publicDisplay?.EMAIL.public && (
                            <a href={`mailto:${email}`} title="Send an email">
                                <IconRow>
                                    <Icon
                                        icon={mailIcon}
                                        color={'#98a4b3'}
                                        style={{ marginRight: '15px', fontSize: '24px' }}
                                    />
                                    {email}
                                </IconRow>
                            </a>
                        )}
                        {phone && isPro && publicDisplay?.PHONE.public && (
                            <a href={`tel:${phone}`} title="Call">
                                <IconRow>
                                    <Icon
                                        icon={phoneIcon}
                                        color={'#98a4b3'}
                                        style={{ marginRight: '15px', fontSize: '24px' }}
                                    />
                                    {phone}
                                </IconRow>
                            </a>
                        )}
                    </Col>
                </SidebarContent>
            )}
            {bookingEnabled && <BookingButton user={user} location={location} />}
        </Sidebar>
    );
};

const UserContainer = styled(Container)`
    .sidebar {
        margin-top: -220px;
        margin-bottom: 30px;
        margin-right: 60px;
        @media only screen and (max-width: 768px) {
            margin-right: 30px;
        }
    }
`;

const Content = React.memo(({ match, ...userProps }) => {
    const { user, loading, location } = userProps;
    const showPrivateRoutes = loading || user?.isOwn;
    const bookingEnabled = user?.isDj && !user.userSettings.standby;
    const history = useHistory();

    // check for event
    const queries = queryString.parse(location.search);
    const { eventId, hash } = queries;
    let comingFromEvent = false;
    if (eventId && hash) {
        comingFromEvent = true;
    }

    const overviewIsEvents = showPrivateRoutes && !user?.isDj;

    return (
        <div>
            <ScrollToTop animate top={280} />

            {comingFromEvent && <BackToEvent eventId={eventId} hash={hash} />}

            <Header user={user} loading={loading} pathname={match.url} />

            <UserContainer>
                <Row style={{ alignItems: 'stretch' }}>
                    <Col>
                        <UserSidebar {...userProps} bookingEnabled={bookingEnabled} />
                        {bookingEnabled && <MobileBookingButton {...userProps} />}
                    </Col>
                    <Col
                        style={{
                            marginTop: '42px',
                            width: '100%',
                            marginBottom: '60px',
                            zIndex: 0,
                            position: 'relative',
                        }}
                    >
                        <Switch location={location}>
                            <Route
                                path={[match.url + '/overview', match.url + '/checkout']}
                                render={(props) =>
                                    overviewIsEvents ? (
                                        <Events {...props} {...userProps} />
                                    ) : (
                                        <Overview {...props} {...userProps} />
                                    )
                                }
                            />
                            <Route
                                path={match.url + '/reviews'}
                                render={(props) => <Reviews {...props} {...userProps} />}
                            />
                            <Route
                                path={match.path + '/photos'}
                                render={(props) => <Photos {...props} {...userProps} />}
                            />
                            <Route
                                path={[match.path + '/sounds', match.path + '/sounds/:id']}
                                render={(props) => <Sounds {...props} {...userProps} />}
                            />
                            {showPrivateRoutes ? (
                                <Route
                                    path={match.url + '/settings'}
                                    render={(props) => <Settings {...props} {...userProps} />}
                                />
                            ) : !userProps.loading ? (
                                <Route
                                    path={match.url + '/settings'}
                                    render={(props) => <LoginPopup {...props} {...userProps} />}
                                />
                            ) : null}

                            {showPrivateRoutes ? (
                                <Route
                                    path={match.url + '/gigs'}
                                    render={(props) => <Gigs {...props} {...userProps} />}
                                />
                            ) : !userProps.loading ? (
                                <Route
                                    path={match.url + '/gigs'}
                                    render={(props) => <LoginPopup {...props} {...userProps} />}
                                />
                            ) : null}

                            {showPrivateRoutes ? (
                                <Route
                                    path={match.url + '/events'}
                                    render={(props) => <Events {...props} {...userProps} />}
                                />
                            ) : null}

                            <Redirect
                                to={{
                                    pathname: match.url + '/overview' + location.search,
                                    search: location.search,
                                    state: location.state,
                                }}
                            />
                        </Switch>
                    </Col>
                </Row>
            </UserContainer>
            <Route
                path={match.path + '/' + userRoutes.checkout}
                render={(props) => (
                    <PayForm
                        onClose={() =>
                            history.push(match.url + '/' + userRoutes.overview + location.search)
                        }
                        eventId={eventId}
                        eventHash={hash}
                        {...props}
                    />
                )}
            />
        </div>
    );
});

const LoginPopup = ({ translate }) => {
    const [shwowing, setShwowing] = useState(true);

    return (
        <Popup showing={shwowing} width={'568px'} onClickOutside={() => setShwowing(false)}>
            <>
                <TitleClean center>Login</TitleClean>
                <p>{translate('Login to see your gigs')}</p>
                <Login
                    redirect={false}
                    onLogin={async (_) => {
                        window.location.reload();
                    }}
                />
            </>
        </Popup>
    );
};

const User = ({ match, location, user, error, loading, translate }) => {
    const [updateUser, { loading: isSaving, error: updateError }] = useMutation(UPDATE_USER);

    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        setHasScrolled(true);
    }, []);

    const title = user ? user.artistName || user.userMetadata?.firstName : null;
    const thumb = user?.picture?.path || null;
    const description = user ? user.userMetadata?.bio : null;
    if (user) {
        user.title = title;
    }

    return (
        <div>
            {!hasScrolled && <ScrollToTop />}
            {user && (
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />

                    <meta property="og:image" content={thumb} />
                    <meta name="twitter:image" content={thumb} />

                    <meta property="og:type" content={'profile'} />

                    <meta name="description" content={description} />
                    <meta name="twitter:description" content={description} />
                    <meta property="og:description" content={description} />

                    {user.isOwn && (
                        <meta
                            name="apple-itunes-app"
                            content="app-id=1458267647, app-argument=userProfile"
                        />
                    )}
                </Helmet>
            )}
            <SavingIndicator loading={isSaving} error={error || updateError} />

            <UserRoutes
                loading={loading}
                user={user}
                updateUser={updateUser}
                match={match}
                location={location}
                translate={translate}
            />

            <Footer
                noSkew
                firstTo={translate(appRoutes.home)}
                secondTo={translate(appRoutes.howItWorks)}
                firstLabel={translate('how-it-works')}
                secondLabel={translate('arrange-event')}
                title={translate('Wonder how it works?')}
                subTitle={translate('See how it works, or arrange an event.')}
            />
        </div>
    );
};

const UserRoutes = ({ match, user, loading, updateUser, location }) => {
    const { translate } = useTranslate();

    useLogActivity({
        type: ACTIVITY_TYPES.PROFILE_VIEW,
        subjectId: user && user.id,
        skipInView: true,
    });

    return (
        <Switch>
            <Route
                path={match.path + '/' + userRoutes.booking}
                render={(props) => (
                    <Booking {...props} user={user} loading={loading} translate={translate} />
                )}
            />
            <Route
                render={() => (
                    <Content
                        match={match}
                        user={user}
                        loading={loading}
                        translate={translate}
                        updateUser={updateUser}
                        location={location}
                    />
                )}
            />
        </Switch>
    );
};

const ProfileImg = styled(GracefullImage)`
    width: 300px;
    height: 300px;
    object-fit: cover;
    @media only screen and (max-width: 900px) {
        width: 250px;
        height: 250px;
    }
`;

const isObject = (o) => Object.prototype.toString.call(o) === '[object Object]';

/**
 * Object merger where o2 takes precedence when value is not an object
 * @param  {} o1
 * @param  {} o2
 */
const mergeObjects = (o1, o2) => {
    if (isObject(o1) && isObject(o2)) {
        const keys = [...new Set([...Object.keys(o1), ...Object.keys(o2)])];

        // iterate over keys
        return keys.reduce((merged, key) => {
            const v1 = o1[key];
            const v2 = o2[key];

            return {
                ...merged,
                [key]: mergeObjects(v1, v2),
            };
        }, {});
    }
    if (o2 === undefined || o2 === null) {
        return o1;
    }

    return o2;
};

const DataWrapper = (props) => {
    const { match } = props;
    const { translate } = useNamespaceContent(content, 'user');

    const { data, loading: loadingMe } = useQuery(ME);
    const { data: userData, loading: loadingUser, error } = useQuery(USER, {
        variables: { permalink: match.params.permalink },
    });

    const { user: profileUser } = userData || {};
    const me = data?.me;

    if (!loadingUser && !profileUser) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    let user = profileUser || {};
    user.isOwn = match.params.permalink === me?.permalink;

    if (me && !me.appMetadata.onboarded && user?.isOwn) {
        return <Redirect to={'/complete-signup'} />;
    }

    if (user.isOwn && me) {
        user = mergeObjects(user, me);
    }

    if (!user.userMetadata) {
        user.userMetadata = {};
    }
    if (!user.appMetadata) {
        user.appMetadata = {};
    }

    const loading = loadingMe || (!user.isOwn && loadingUser);

    return <User {...props} user={user} error={error} loading={loading} translate={translate} />;
};

// eslint-disable-next-line import/no-unused-modules
export default DataWrapper;
