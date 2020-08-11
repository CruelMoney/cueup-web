import React, { useRef, useEffect, useState, useCallback, forwardRef } from 'react';
import { Helmet } from 'react-helmet-async';
import { Route, Redirect, Switch } from 'react-router-dom';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { LazyContactInformationPopup, LazyChatGetProPopup } from 'routes/GetProfessional';
import { useAppState } from 'components/hooks/useAppState';
import ScrollToTop from '../../components/common/ScrollToTop';
import Footer from '../../components/common/Footer';
import { Container, Row, Col, TeritaryButton, SmartButton } from '../../components/Blocks';
import { gigStates } from '../../constants/constants';
import { Title, Body } from '../../components/Text';
import CheckboxTable from '../../components/CheckboxTable';
import Popup from '../../components/common/Popup';
import { ME } from '../../components/gql';
import useLogActivity, { ACTIVITY_TYPES } from '../../components/hooks/useLogActivity';
import useWindowSize from '../../components/hooks/useWindowSize';
import Login from '../../components/common/Login';
import { GIG, DECLINE_GIG, CANCEL_GIG } from './gql.js';
import GigHeader from './components/blocks/GigHeader';
import Information from './routes/Information';
import Offer from './routes/Offer';

import BackToProfile from './components/BackToProfile';
import GigReview from './routes/GigReview';
import content from './content.json';
import { getSystemMessage } from './utils';

const Index = ({ location, match, history }) => {
    const { translate } = useNamespaceContent(content, 'gig');

    const {
        params: { id },
    } = match;
    const { data = {}, error, loading: loadingGig, refetch: refetchGig } = useQuery(GIG, {
        skip: !id,

        variables: {
            id,
        },
    });
    const { loading: loadingMe, data: meData } = useQuery(ME);
    const { me } = meData || {};

    const { gig } = data;

    const loading = loadingGig || loadingMe;

    useLogActivity({
        type: ACTIVITY_TYPES.GIG_VIEWED_BY_DJ,
        subjectId: gig && gig.id,
        skipInView: true,
    });

    useEffect(() => {
        window.scrollTo({ top: 0 });
    }, []);

    const redirectToHome = () => history.push('/');

    if (error && error.message.includes('Not your gig')) {
        return <Redirect to={translate(appRoutes.notFound)} />;
    }

    const { event, status } = gig || {};

    const title = event ? event.name : 'Cueup | Event';
    const description = event ? event.description : null;
    if (gig) {
        gig.showInfo = status === gigStates.CONFIRMED || me?.appMetadata?.isPro;
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

            <Popup width="380px" showing={!me && !loading} onClickOutside={redirectToHome}>
                <Login redirect={false} onLogin={refetchGig} />
            </Popup>

            <Footer
                noSkew
                firstTo={translate(appRoutes.howItWorks)}
                secondTo={translate(appRoutes.home)}
                firstLabel={translate('how-it-works')}
                secondLabel={translate('arrange-event')}
                title={translate('Organizing a new event?')}
                subTitle={translate('See how it works, or arrange an event.')}
            />
        </div>
    );
};

const Content = React.memo((props) => {
    const { theEvent, loading, gig, history, me } = props;
    const { organizer } = theEvent || {};
    const { statusHumanized } = gig || {};
    const { setAppState } = useAppState();

    const [popup, setPopup] = useState(false);

    const showDecline = useCallback(() => setPopup(true), []);
    const navigateToOffer = useCallback(() => history.push('offer'), [history]);

    useEffect(() => {
        if (theEvent) {
            const systemMessages = [];
            systemMessages.push(getSystemMessage({ gig, navigateToOffer, showDecline }));

            setAppState({
                showSideBarChat: true,
                activeEvent: theEvent,
                chat: {
                    id: gig.id,
                    receiver: organizer,
                    sender: me,
                    dj: me,
                    gig,
                    systemMessages,
                },
                activeChatId: gig.id,
            });
        }
    }, [setAppState, theEvent, gig, me, organizer]);

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
                            {/* <ChatSidebar
                                theEvent={theEvent}
                                gig={gig}
                                loading={loading}
                                organizer={organizer}
                                showDecline={showDecline}
                                navigateToOffer={navigateToOffer}
                                me={me}
                            /> */}
                        </Col>
                    )}
                </ContainerRow>
            </GigContainer>
            <Popup width={530} showing={popup} onClickOutside={() => setPopup(false)}>
                <CancelationDeclinePopup
                    gig={gig}
                    hide={() => setPopup(false)}
                    onCancelled={() => {
                        setPopup(false);
                        history.push('information');
                    }}
                />
            </Popup>
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
        </Switch>
    );
});

const CancelationDeclinePopup = ({ gig, hide, onCancelled }) => {
    const [reason, setReason] = useState(null);
    const isCancel = gig.status === gigStates.CONFIRMED;
    const mutation = isCancel ? CANCEL_GIG : DECLINE_GIG;
    const [mutate, { loading: cancelling }] = useMutation(mutation, {
        variables: {
            reason,
            id: gig.id,
        },
        onCompleted: () => {
            onCancelled();
        },
    });

    const doMutate = () => {
        if (!reason) {
            window.alert('Please select a reason');
            return;
        }
        mutate();
    };

    const cancelText =
        'Are you sure you want to cancel the gig? All money will be refunded to the organizer. \nPlease let us know the reason for cancelling and if we can do anything better.';
    const declineText =
        'Are you sure you want to decline the gig? You will not be able to get the gig back. \nPlease let us know the reason for declining so we can get you better gigs in the future.';

    const declineOptions = {
        0: {
            label: "I can't play that day",
        },
        1: {
            label: 'The gig is out of my area',
        },
        2: {
            label: "I don't have the required equipment",
        },
        3: {
            label: 'The gig is not my style',
        },
        4: {
            label: 'I feel overqualified',
        },
        5: {
            label: 'I feel underqualified',
        },
        6: {
            label: 'The budget is too small',
        },
    };

    const cancelOptions = {
        0: {
            label: "I can't play that day",
        },
        1: {
            label: 'The organizer changed the requirements',
        },
        2: {
            label: "I don't feel comfortable playing this gig",
        },
    };

    return (
        <div>
            <Title>{isCancel ? 'Cancel' : 'Decline'} gig</Title>
            <Body>{isCancel ? cancelText : declineText}</Body>

            <CheckboxTable
                style={{ marginTop: '42px', marginBottom: '42px' }}
                options={isCancel ? cancelOptions : declineOptions}
                onSave={setReason}
            />

            <Row style={{ marginTop: '42px' }} right>
                <TeritaryButton type="button" onClick={hide}>
                    Keep gig
                </TeritaryButton>
                <SmartButton
                    warning
                    loading={cancelling}
                    level="secondary"
                    onClick={() => doMutate()}
                >
                    {isCancel ? 'Cancel gig' : 'Decline gig'}
                </SmartButton>
            </Row>
        </div>
    );
};

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
