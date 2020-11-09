import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { LazyContactInformationPopup, LazyChatGetProPopup } from 'routes/GetProfessional';
import Menu from 'components/Navigation';
import ScrollToTop from '../../components/common/ScrollToTop';
import Footer from '../../components/common/Footer';
import { Container, Row, Col } from '../../components/Blocks';
import { gigStates } from '../../constants/constants';
import { ME } from '../../components/gql';
import useLogActivity, { ACTIVITY_TYPES } from '../../components/hooks/useLogActivity';
import useWindowSize from '../../components/hooks/useWindowSize';
import { GIG } from './gql.js';
import GigHeader from './components/blocks/GigHeader';
import Information from './routes/Information';
import Offer from './routes/Offer';
import ChatSidebar from './components/ChatSidebar';

import BackToProfile from './components/BackToProfile';
import GigReview from './routes/GigReview';
import MobileChat from './routes/MobileChat';
import content from './content.json';
import CancelationDeclinePopup from './components/CancelationDeclinePopup';

const Index = () => {
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    const { translate } = useNamespaceContent(content, 'gig');

    const {
        params: { id },
    } = match;
    const { data = {}, error, loading: loadingGig } = useQuery(GIG, {
        skip: !id,

        variables: {
            id,
        },
    });
    const { loading: loadingMe, data: meData } = useQuery(ME);
    const { me } = meData || {};

    let { gig } = data;
    gig = { ...gig };

    const loading = loadingGig || loadingMe;

    useLogActivity({
        type: ACTIVITY_TYPES.GIG_VIEWED_BY_DJ,
        subjectId: gig && gig.id,
        skipInView: true,
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    if (error && error.message.includes('Not your gig')) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    const { event, status } = gig || {};

    const title = event ? event.name : 'Cueup | Event';
    const description = event ? event.description : null;
    if (gig) {
        gig.showInfo = status === gigStates.CONFIRMED || me?.appMetadata?.isPro;
    }

    if (!loading && !me) {
        return (
            <Redirect
                to={`/login?redirect=${encodeURIComponent(location.pathname + location.search)}`}
            />
        );
    }

    return (
        <div>
            {event && (
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />

                    <meta name="description" content={description} />
                    <meta name="twitter:description" content={description} />
                    <meta property="og:description" content={description} />
                    <meta
                        name="apple-itunes-app"
                        content="app-id=1458267647, app-argument=userProfile"
                    />
                </Helmet>
            )}
            <Menu />
            <ScrollToTop animate top={295} />

            {me && <BackToProfile permalink={me.permalink} />}
            <Content
                location={location}
                match={match}
                theEvent={event}
                gig={gig}
                loading={loading}
                translate={translate}
                history={history}
                me={me}
            />

            <Footer noSkew noPreFooter />
        </div>
    );
};

const Content = React.memo((props) => {
    const { theEvent, loading, gig, history, me } = props;
    const { organizer } = theEvent || {};
    const { statusHumanized } = gig || {};

    const [popup, setPopup] = useState(false);

    const showDecline = useCallback(() => setPopup(true), []);
    const navigateToOffer = useCallback(() => history.push('offer'), [history]);

    const { width } = useWindowSize();

    return (
        <div>
            <GigHeader theEvent={theEvent} loading={loading} statusHumanized={statusHumanized} />

            <GigContainer>
                <ContainerRow>
                    <MainContent
                        {...props}
                        setPopup={setPopup}
                        theEvent={theEvent}
                        gig={gig}
                        loading={loading}
                        organizer={organizer}
                        showDecline={showDecline}
                        navigateToOffer={navigateToOffer}
                        me={me}
                    />
                    {width > 420 && (
                        <Col>
                            <ChatSidebar
                                theEvent={theEvent}
                                gig={gig}
                                loading={loading}
                                organizer={organizer}
                                showDecline={showDecline}
                                navigateToOffer={navigateToOffer}
                                me={me}
                            />
                        </Col>
                    )}
                </ContainerRow>
            </GigContainer>
            {popup && (
                <CancelationDeclinePopup
                    gig={gig}
                    hide={() => setPopup(false)}
                    onCancelled={() => {
                        setPopup(false);
                        history.push('information');
                    }}
                />
            )}
        </div>
    );
});

const MainContent = (props) => {
    const { location, setPopup } = props;
    const [height, setHeight] = useState('auto');
    const [ssr, setSsr] = useState(true);

    useEffect(() => {
        setSsr(false);
    }, []);

    return (
        <BorderCol style={{ height: height || 'auto' }}>
            <Switch>
                <Redirect exact from={'/gig/:id'} to={'/gig/:id/information'} />
            </Switch>
            <GigRoutes
                {...props}
                ssr={ssr}
                registerHeight={setHeight}
                showDecline={() => setPopup(true)}
            />

            <Route component={LazyContactInformationPopup} path={'*/contact-get-pro'} />
            <Route component={LazyChatGetProPopup} path={'*/chat-get-pro'} />
        </BorderCol>
    );
};

const GigRoutes = forwardRef((props, ref) => {
    const { match } = props;
    return (
        <Switch>
            <Route
                path={match.path + '/information'}
                render={(navProps) => <Information {...navProps} {...props} />}
            />
            <Route
                path={match.path + '/offer'}
                render={(navProps) => <Offer {...navProps} {...props} />}
            />
            <Route
                path={match.path + '/review'}
                render={(navProps) => <GigReview {...navProps} {...props} />}
            />
            <Route
                path={match.path + '/chat'}
                render={(navProps) => <MobileChat {...navProps} {...props} />}
            />
        </Switch>
    );
});

const ContainerRow = styled(Row)`
    align-items: stretch;
    padding-top: 30px;
    padding-bottom: 60px;
`;

const BorderCol = styled(Col)`
    padding-right: 42px;
    width: 100%;
    z-index: 0;
    @media only screen and (max-width: 768px) {
        border-right: none;
        padding-right: 0;
    }
`;

const GigContainer = styled(Container)`
    .sidebar {
        margin-top: -250px;
        margin-left: 60px;
        padding: 0;
    }
`;
// eslint-disable-next-line import/no-unused-modules
export default Index;
