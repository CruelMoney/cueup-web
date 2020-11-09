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
import GreyBox from 'components/GreyBox';
import ScrollToTop from '../../components/common/ScrollToTop';
import Footer from '../../components/common/Footer';
import { Container, Row, Col, Hr, RowWrap } from '../../components/Blocks';
import { gigStates } from '../../constants/constants';
import { ME } from '../../components/gql';
import useLogActivity, { ACTIVITY_TYPES } from '../../components/hooks/useLogActivity';
import { GIG } from './gql.js';
import Information from './routes/Information';
import Offer from './routes/Offer';
import BackToProfile from './components/BackToProfile';
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
            {me && <BackToProfile permalink={me.permalink} />}
            <Menu dark relative />

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
            />

            <Footer noSkew noPreFooter />
        </div>
    );
};

const GigContainer = styled(Container)`
    min-height: 70vh;
    @media only screen and (max-width: 698px) {
        overflow: hidden;
        ${GreyBox} {
            padding: 12px;
        }
    }
`;

const Content = React.memo((props) => {
    const { theEvent, loading, gig, history, me } = props;

    const [popup, setPopup] = useState(false);
    const showDecline = useCallback(() => setPopup(true), []);

    return (
        <div>
            <GigContainer>
                <Hr style={{ marginBottom: 30 }} />
                <RowWrap style={{ margin: '0 -30px' }}>
                    <Col style={{ padding: '0 30px', flex: 1, minWidth: 'min(80%, 400px)' }}>
                        <Information gig={gig} loading={loading} />
                    </Col>
                    <Col
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
                            loading={loading}
                            showDecline={showDecline}
                            me={me}
                        />
                    </Col>
                </RowWrap>
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

            <Route component={LazyContactInformationPopup} path={'*/contact-get-pro'} />
            <Route component={LazyChatGetProPopup} path={'*/chat-get-pro'} />
        </div>
    );
});

// eslint-disable-next-line import/no-unused-modules
export default Index;
