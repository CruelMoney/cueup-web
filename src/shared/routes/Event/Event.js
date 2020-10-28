import React, { useEffect, forwardRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import styled from 'styled-components';
import { useRouteMatch, useHistory } from 'react-router';
import { appRoutes, eventRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { useServerContext } from 'components/hooks/useServerContext';
import { useNotifications } from 'components/hooks/useNotifications';
import { useAppState } from 'components/hooks/useAppState';
import Popup from 'components/common/Popup';
import ScrollToTop from '../../components/common/ScrollToTop';
import Footer from '../../components/common/Footer';
import { Container, Row, Col } from '../../components/Blocks';
import EventProgress from './components/blocks/EventProgress';
import { EVENT } from './gql.js';
import EventHeader from './components/blocks/EventHeader.js';
import Overview from './routes/Overview';
import Requirements from './routes/Requirements';
import Review from './routes/Review';
import content from './content.json';
import CancelationPopup from './components/blocks/CancelationPopup';

const Index = ({ location }) => {
    const match = useRouteMatch();
    const { setAppState } = useAppState();
    const { translate } = useNamespaceContent(content, 'event');
    const { id, hash } = match.params;
    const { data, loading } = useQuery(EVENT, {
        skip: !id || !hash,
        variables: {
            id,
            hash,
        },
    });

    const theEvent = useMemo(() => ({ ...data?.event }), [data]);
    if (theEvent) {
        theEvent.hash = match.params.hash;
    }

    const [notifications] = useNotifications({
        userId: theEvent?.organizer?.id,
    });

    const setActiveChat = (chat) => setAppState({ activeChat: chat });

    useEffect(() => {
        if (theEvent) {
            setAppState({ showSideBarChat: true, activeEvent: theEvent });
        }
    }, [setAppState, theEvent]);

    if (!loading && !theEvent) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    const title = theEvent ? theEvent.name : 'Cueup | Event';
    const description = theEvent ? theEvent.description : null;

    return (
        <div>
            {theEvent && (
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />

                    <meta name="description" content={description} />
                    <meta name="twitter:description" content={description} />
                    <meta property="og:description" content={description} />
                    <meta name="robots" content="noindex" />
                </Helmet>
            )}

            <Content
                location={location}
                match={match}
                theEvent={theEvent}
                loading={loading}
                translate={translate}
                notifications={notifications}
                setActiveChat={setActiveChat}
            />

            <Footer noSkew noPreFooter />
        </div>
    );
};

const Content = React.memo((props) => {
    const { match, ...eventProps } = props;
    const { theEvent, loading } = eventProps;
    const { isSSR } = useServerContext();
    const history = useHistory();

    return (
        <div>
            <ScrollToTop animate top={280} />
            <EventHeader theEvent={theEvent} loading={loading} pathname={match.url} />
            <Container>
                <ContainerRow>
                    <BorderCol>
                        <GigRoutes
                            {...props}
                            ssr={isSSR}
                            style={props}
                            match={match}
                            eventProps={eventProps}
                        />
                    </BorderCol>
                    <Col>
                        <EventProgress theEvent={theEvent} />
                    </Col>
                </ContainerRow>
            </Container>
            <Route path={'*/cancel'}>
                <Popup
                    width={530}
                    showing={true}
                    onClickOutside={() => history.push(match.url + '/overview')}
                >
                    <CancelationPopup
                        onCancelled={() => {
                            history.push(match.url + '/overview');
                        }}
                        theEvent={theEvent}
                        hide={() => history.push(match.url + '/overview')}
                    />
                </Popup>
            </Route>
        </div>
    );
});

const GigRoutes = forwardRef((props, ref) => {
    const { match, eventProps } = props;

    return (
        <Switch>
            <Route
                path={match.path + '/' + eventRoutes.overview}
                render={(navProps) => <Overview {...navProps} {...props} {...eventProps} />}
            />
            <Route
                path={match.path + '/' + eventRoutes.requirements}
                render={(navProps) => (
                    <Requirements {...navProps} {...props} {...eventProps} pathname={match.url} />
                )}
            />
            <Route
                path={match.path + '/' + eventRoutes.review}
                render={(navProps) => <Review {...navProps} {...props} {...eventProps} />}
            />
        </Switch>
    );
});

const ContainerRow = styled(Row)`
    align-items: stretch;
    padding-top: 30px;
    padding-bottom: 60px;
    @media only screen and (max-width: 768px) {
        flex-direction: column-reverse;
    }
`;

const BorderCol = styled(Col)`
    border-right: 1px solid #e9ecf0;
    padding-right: 42px;
    width: 100%;
    z-index: 0;
    @media only screen and (max-width: 768px) {
        border-right: none;
        padding-right: 0;
    }
`;

// eslint-disable-next-line import/no-unused-modules
export default Index;
