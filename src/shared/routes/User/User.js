import React, { useState, useEffect } from 'react';
import { Switch, Route, Redirect, useHistory } from 'react-router';
import styled from 'styled-components';
import { useQuery } from '@apollo/client';
import queryString from 'query-string';

import { Helmet } from 'react-helmet-async';
import PayForm from 'components/common/PayForm.js';

import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { DJSeoTags } from 'components/SeoTags';
import { Media } from 'components/MediaContext';
import Menu from 'components/Navigation';
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
import useLogActivity, { ACTIVITY_TYPES } from '../../components/hooks/useLogActivity';
import BookingButton from './components/BookingButton';
import ProfileProgress from './components/ProfileProgress';
import { Overview, Reviews, Booking, Photos, Sounds } from './routes';

import { USER } from './gql';
import BackToEvent from './components/BackToEvent';
import Header from './components/Header';
import { Stats, UserInfo } from './components/Common';
import content from './content.json';

const UserSidebar = ({ user, bookingEnabled }) => {
    const { userMetadata = {}, appMetadata = {} } = user || {};
    const { experience } = appMetadata;
    let { followers } = appMetadata;

    if (followers && followers.total < 500) {
        followers = false;
    }

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

            {!user ? (
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

                    <SmallHeader style={{ marginBottom: '15px' }}>
                        {`Hi I'm ${userMetadata?.firstName}`}
                    </SmallHeader>

                    <Col
                        style={{
                            alignItems: 'flex-start',
                            marginBottom: '-15px',
                        }}
                    >
                        <UserInfo user={user} />
                    </Col>
                </SidebarContent>
            )}
            {bookingEnabled && <BookingButton user={user} />}
        </Sidebar>
    );
};

const UserContainer = styled(Container)`
    .sidebar {
        margin-top: -220px;
        margin-bottom: 30px;
        margin-right: 60px;
        @media only screen and (max-width: 990px) {
            margin-right: 30px;
        }
    }
`;

const Content = React.memo(({ match, ...userProps }) => {
    const { user, loading, location } = userProps;
    const bookingEnabled = user?.isDj;
    const history = useHistory();

    // check for event
    const queries = queryString.parse(location.search);
    const { eventId, hash } = queries;
    let comingFromEvent = false;
    if (eventId && hash) {
        comingFromEvent = true;
    }

    return (
        <div>
            <ScrollToTop animate top={280} />

            {comingFromEvent && <BackToEvent eventId={eventId} hash={hash} />}

            <Header user={user} loading={loading} pathname={match.url} />

            <UserContainer>
                <Row style={{ alignItems: 'stretch' }}>
                    <Media greaterThan={'sm'}>
                        <UserSidebar {...userProps} bookingEnabled={bookingEnabled} />
                    </Media>
                    <Col
                        style={{
                            width: '100%',
                            marginBottom: '60px',
                            zIndex: 0,
                            position: 'relative',
                        }}
                    >
                        <Switch location={location}>
                            <Route
                                path={[match.url + '/overview', match.url + '/checkout']}
                                render={(props) => <Overview {...props} {...userProps} />}
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
    const [hasScrolled, setHasScrolled] = useState(false);

    useEffect(() => {
        setHasScrolled(true);
    }, []);

    const title = user ? user.artistName || user.userMetadata?.firstName : 'Unnamed';
    const metaTitle = title + ' · Book now · Cueup';
    const thumb = user?.picture?.path || null;
    const description = user ? user.userMetadata?.bio : `${title} has not written a bio yet.`;
    if (user) {
        user.title = title;
    }

    return (
        <div>
            <DJSeoTags {...user} />
            {!hasScrolled && <ScrollToTop />}
            {user && (
                <Helmet>
                    <title>{metaTitle}</title>
                    <meta property="og:title" content={metaTitle} />
                    <meta name="twitter:title" content={metaTitle} />

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

            <UserRoutes
                loading={loading}
                user={user}
                match={match}
                location={location}
                translate={translate}
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
                path={[match.path + '/' + userRoutes.booking, '/:permalink/book']}
                render={(props) => (
                    <Booking {...props} user={user} loading={loading} translate={translate} />
                )}
            />
            <Route
                render={() => (
                    <>
                        <Menu />
                        <Content
                            match={match}
                            user={user}
                            loading={loading}
                            translate={translate}
                            updateUser={updateUser}
                            location={location}
                        />
                        <Footer noSkew noPreFooter />
                    </>
                )}
            />
        </Switch>
    );
};

const ProfileImg = styled(GracefullImage)`
    width: 300px;
    height: 300px;
    object-fit: cover;
    @media only screen and (max-width: 990px) {
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
    const { match, location } = props;
    const routeDj = location.state?.dj || {};

    const { translate } = useNamespaceContent(content, 'user');

    const { data, loading: loadingMe } = useQuery(ME);
    const { data: userData, loading: loadingUser, error } = useQuery(USER, {
        variables: { permalink: match.params.permalink },
    });

    const { user: profileUser } = userData || { user: routeDj };
    const me = data?.me;

    if (!loadingUser && !profileUser) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    let user = { ...profileUser } || {};
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

    const loading = loadingMe || !user.id;

    return <User {...props} user={user} error={error} loading={loading} translate={translate} />;
};

// eslint-disable-next-line import/no-unused-modules
export default DataWrapper;
