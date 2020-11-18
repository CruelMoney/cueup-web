import React, { useEffect, forwardRef, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { useRouteMatch, useHistory } from 'react-router';
import { appRoutes, eventRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { useServerContext } from 'components/hooks/useServerContext';
import { useNotifications } from 'components/hooks/useNotifications';
import { useAppState } from 'components/hooks/useAppState';
import Popup from 'components/common/Popup';
import Menu from 'components/Navigation';
import { Container, Row, Col, Hr, RowMobileCol } from '../../components/Blocks';
import EventProgress from './components/blocks/EventProgress';
import { EVENT } from './gql.js';
import Overview from './routes/Overview';
import Requirements from './routes/Requirements';
import Review from './routes/Review';
import content from './content.json';
import CancelationPopup from './components/blocks/CancelationPopup';
import Sidebar from './components/blocks/Sidebar';

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
            <Menu dark relative fullWidth />
            <Container fullWidth>
                <Hr />
                <RowMobileCol style={{ marginTop: 24, flexGrow: 1, flexWrap: 'nowrap' }}>
                    <Sidebar theEvent={theEvent} />
                    <Content
                        location={location}
                        match={match}
                        theEvent={theEvent}
                        loading={loading}
                        translate={translate}
                        notifications={notifications}
                        setActiveChat={setActiveChat}
                    />
                    <EventProgress theEvent={theEvent} />
                </RowMobileCol>
            </Container>
        </div>
    );
};

const Content = React.memo((props) => {
    const { match, ...eventProps } = props;
    const { theEvent, loading } = eventProps;
    const { isSSR } = useServerContext();
    const history = useHistory();

    return (
        <Col style={{ flexGrow: 1 }}>
            <GigRoutes {...props} ssr={isSSR} style={props} match={match} eventProps={eventProps} />
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
        </Col>
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

// eslint-disable-next-line import/no-unused-modules
export default Index;
