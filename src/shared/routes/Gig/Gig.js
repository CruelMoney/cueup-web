import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/client';
import styled from 'styled-components';
import { useHistory, useLocation, useRouteMatch } from 'react-router';
import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { LazyContactInformationPopup, LazyChatGetProPopup } from 'routes/GetProfessional';
import GreyBox from 'components/GreyBox';
import { useAppState } from 'components/hooks/useAppState';
import ScrollToTop from '../../components/common/ScrollToTop';
import Footer from '../../components/common/Footer';
import { Container, Row, Col, Hr, RowWrap } from '../../components/Blocks';
import { gigStates } from '../../constants/constants';
import { ME } from '../../components/gql';
import useLogActivity, { ACTIVITY_TYPES } from '../../components/hooks/useLogActivity';
import { GIG, OPPORTUNITY } from './gql.js';
import Information from './routes/Information';
import Offer from './routes/Offer';
import BackToProfile from './components/BackToProfile';
import content from './content.json';
import CancelationDeclinePopup from './components/CancelationDeclinePopup';

const Index = () => {
    const location = useLocation();
    const history = useHistory();
    const match = useRouteMatch();

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    const { translate } = useNamespaceContent(content, 'gig');

    const {
        params: { id },
    } = match;

    const opportunity = location.pathname.includes(translate(appRoutes.opportunity));

    const gqlQuery = opportunity ? OPPORTUNITY : GIG;

    const { data = {}, error, loading: loadingGig } = useQuery(gqlQuery, {
        skip: !id,
        variables: {
            id,
        },
        onCompleted: ({ opportunity }) => {
            if (opportunity?.gig) {
                history.replace(`${translate(appRoutes.gig)}/${opportunity.gig.id}`);
            }
        },
    });
    const { loading: loadingMe, data: meData } = useQuery(ME);
    const { me } = meData || {};

    if (error && error.message.includes('Not your gig')) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    let gig = null;
    let event = null;
    gig = data?.gig;
    event = gig?.event;
    gig = { ...gig };

    if (!opportunity && !loadingGig && !gig.id) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    const { status, referred } = gig || {};

    const loading = loadingGig || loadingMe;

    const title = event ? event.name : 'Gig · Cueup';
    const description = event ? event.description : null;
    if (gig) {
        gig.showInfo = status === gigStates.CONFIRMED || me?.appMetadata?.isPro || referred;
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
            {me && <BackToProfile permalink={me.permalink} />}

            <ScrollToTop animate top={295} />

            <Content
                location={location}
                match={match}
                theEvent={event}
                gig={gig}
                loading={loading}
                translate={translate}
                history={history}
                me={me}
                opportunity={opportunity}
            />
        </div>
    );
};

const GigContainer = styled(Container)`
    padding-top: 30px;
    @media only screen and (max-width: 698px) {
        overflow: hidden;
        ${GreyBox} {
            padding: 12px;
        }
    }
`;

const Content = React.memo((props) => {
    const history = useHistory();
    const { pathname } = useLocation();
    const { url } = useRouteMatch();
    const { theEvent, loading, gig, me, opportunity } = props;
    const { setAppState } = useAppState();
    const makeOfferRef = useRef();

    const showDecline = useCallback(() => history.replace(url + '/decline'), [url, history]);
    const hideDecline = useCallback(() => history.replace(url), [url, history]);

    useLogActivity({
        type: ACTIVITY_TYPES.GIG_VIEWED_BY_DJ,
        subjectId: gig && gig.id,
        skipInView: true,
        manual: opportunity, // don't log for opportunities
    });

    const makeOfferPath = pathname.includes('offer');

    const openChat = useCallback(() => {
        setAppState({
            showSideBarChat: true,
            activeEvent: null,
            activeChat: gig.id,
            activeGig: gig,
        });
    }, [setAppState, gig]);

    const scrollToMakeOffer = useCallback(() => {
        let top = 0;
        if (makeOfferRef.current) {
            const bodyRectTop = document.body.getBoundingClientRect().top;
            const searchTop = makeOfferRef.current.getBoundingClientRect().top;
            top = searchTop - bodyRectTop - 20;
            window.scrollTo({
                top,
                left: 0,
                behavior: 'smooth',
            });
        }
    }, []);

    // hide chat on offer path
    useEffect(() => {
        if (makeOfferPath && !loading) {
            scrollToMakeOffer();
        }
    }, [scrollToMakeOffer, makeOfferPath, loading]);

    return (
        <div>
            <GigContainer>
                <RowWrap style={{ margin: '0 -30px' }}>
                    <Col style={{ padding: '0 30px', flex: 1, minWidth: 'min(80%, 400px)' }}>
                        <Information
                            gig={gig}
                            theEvent={theEvent}
                            opportunity={opportunity}
                            loading={loading}
                            openChat={openChat}
                        />
                    </Col>
                    <Col
                        ref={makeOfferRef}
                        style={{
                            padding: '0 30px',
                            position: 'sticky',
                            top: 15,
                            flex: 1,
                            minWidth: 'min(80%, 400px)',
                        }}
                    >
                        <Offer
                            theEvent={theEvent}
                            gig={gig}
                            opportunity={opportunity}
                            loading={loading}
                            showDecline={showDecline}
                            me={me}
                        />
                    </Col>
                </RowWrap>
            </GigContainer>

            <Route path="*/decline">
                <CancelationDeclinePopup gig={gig} hide={hideDecline} onCancelled={hideDecline} />
            </Route>

            <Route component={LazyContactInformationPopup} path={'*/contact-get-pro'} />
            <Route component={LazyChatGetProPopup} path={'*/chat-get-pro'} />
        </div>
    );
});

// eslint-disable-next-line import/no-unused-modules
export default Index;
