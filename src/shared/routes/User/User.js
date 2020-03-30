import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import styled from 'styled-components';
import { Query, useMutation } from 'react-apollo';
import queryString from 'query-string';

import Pin from 'react-ionicons/lib/MdPin';
import moment from 'moment';
import AddCircle from 'react-ionicons/lib/MdAddCircle';
import { Helmet } from 'react-helmet-async';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
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
import {
    Overview,
    Settings,
    Reviews,
    Gigs,
    Events,
    Booking,
    Photos,
    Sounds,
    userRoutes,
} from './routes';

import { USER, UPDATE_USER } from './gql';
import BackToEvent from './components/BackToEvent';
import Header from './components/Header';
import { Stats, MobileBookingButton, IconRow, CertifiedVerified } from './components/Common';
import content from './content.json';

const UserSidebar = ({ user, loading, bookingEnabled, location }) => {
    const { userMetadata = {}, appMetadata = {}, playingLocation } = user || {};
    const { experience, followers, createdAt, certified, identityVerified } = appMetadata;

    const memberSince = moment(createdAt).format('MMMM YYYY');
    return (
        <Sidebar
            showCTAShadow={bookingEnabled}
            stickyTop={'-300px'} // height of image
            childrenBelow={
                user && user.isOwn ? (
                    <ProfileProgress user={user} />
                ) : (
                    <SimpleSharing shareUrl={user && `/user/${user.permalink}/overview`} />
                )
            }
        >
            <ProfileImg src={user ? user.picture.path : null} animate />

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
                    >{`Hi I'm ${userMetadata.firstName}`}</SmallHeader>

                    <Col
                        style={{
                            alignItems: 'flex-start',
                        }}
                    >
                        <IconRow className="iconRow">
                            <AddCircle color={'#98a4b3'} style={{ marginRight: '15px' }} />
                            Member since {memberSince}
                        </IconRow>
                        {playingLocation && (
                            <IconRow>
                                <Pin color={'#98a4b3'} style={{ marginRight: '15px' }} />
                                {playingLocation.name}
                            </IconRow>
                        )}
                        <CertifiedVerified
                            certified={certified}
                            identityVerified={identityVerified}
                        />
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
                                strict
                                exact
                                path={match.url + '/overview'}
                                render={(props) =>
                                    overviewIsEvents ? (
                                        <Events {...props} {...userProps} />
                                    ) : (
                                        <Overview {...props} {...userProps} />
                                    )
                                }
                            />
                            <Route
                                strict
                                exact
                                path={match.url + '/reviews'}
                                render={(props) => <Reviews {...props} {...userProps} />}
                            />
                            <Route
                                strict
                                exact
                                path={match.path + '/photos'}
                                render={(props) => <Photos {...props} {...userProps} />}
                            />
                            <Route
                                strict
                                exact
                                path={[match.path + '/sounds', match.path + '/sounds/:id']}
                                render={(props) => <Sounds {...props} {...userProps} />}
                            />
                            {showPrivateRoutes ? (
                                <Route
                                    strict
                                    exact
                                    path={match.url + '/settings'}
                                    render={(props) => <Settings {...props} {...userProps} />}
                                />
                            ) : !userProps.loading ? (
                                <Route
                                    strict
                                    exact
                                    path={match.url + '/settings'}
                                    render={(props) => <LoginPopup {...props} {...userProps} />}
                                />
                            ) : null}

                            {showPrivateRoutes ? (
                                <Route
                                    strict
                                    exact
                                    path={match.url + '/gigs'}
                                    render={(props) => <Gigs {...props} {...userProps} />}
                                />
                            ) : !userProps.loading ? (
                                <Route
                                    strict
                                    exact
                                    path={match.url + '/gigs'}
                                    render={(props) => <LoginPopup {...props} {...userProps} />}
                                />
                            ) : null}

                            {showPrivateRoutes ? (
                                <Route
                                    strict
                                    exact
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

const Index = ({ match, location }) => {
    const { translate } = useNamespaceContent(content, 'user');
    const [updateUser, { loading: isSaving, error }] = useMutation(UPDATE_USER);
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        setHasScrolled(true);
    }, []);

    return (
        <>
            <Query query={ME} onError={console.warn}>
                {({ data, loading: loadingMe }) => (
                    <Query
                        query={USER}
                        variables={{ permalink: match.params.permalink }}
                        onError={console.warn}
                    >
                        {({ data: userData, loading: loadingUser, error }) => {
                            const { user: profileUser } = userData || {};
                            const loading = loadingMe || loadingUser;
                            const me = data?.me;

                            if (!loading && !profileUser) {
                                return <Redirect to={translate(appRoutes.notFound)} />;
                            }

                            let user = profileUser;

                            if (user && data && data.me) {
                                user.isOwn = user.isOwn || data.me.id === user.id;
                            }

                            if (me && !me.appMetadata.onboarded && user?.isOwn) {
                                return <Redirect to={'/complete-signup'} />;
                            }

                            if (user && user.isOwn && data && data.me) {
                                user = mergeObjects(user, data.me);
                            }

                            const title = user
                                ? user.artistName || user.userMetadata.firstName
                                : null;
                            const thumb = user ? user.picture.path : null;
                            const description = user ? user.userMetadata.bio : null;
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

                                            <meta name="description" content={description} />
                                            <meta
                                                name="twitter:description"
                                                content={description}
                                            />
                                            <meta property="og:description" content={description} />

                                            {user.isOwn && (
                                                <meta
                                                    name="apple-itunes-app"
                                                    content="app-id=1458267647, app-argument=userProfile"
                                                />
                                            )}
                                        </Helmet>
                                    )}
                                    <SavingIndicator loading={isSaving} error={error} />

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
                                        subTitle={translate(
                                            'See how it works, or arrange an event.'
                                        )}
                                    />
                                </div>
                            );
                        }}
                    </Query>
                )}
            </Query>
        </>
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
                path={match.path + userRoutes.booking}
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
    if (!o2) {
        return o1;
    }

    return o2;
};

export default Index;
