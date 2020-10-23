import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory, Route } from 'react-router';
import useTranslate from 'components/hooks/useTranslate';
import { InputRow } from 'components/FormComponents';
import { eventRoutes } from 'constants/locales/appRoutes';
import { REQUEST_EMAIL_VERIFICATION } from 'components/gql';
import usePushNotifications from 'components/hooks/usePushNotifications';
import PayForm from 'components/common/PayForm';
import { Title, Body, HeaderTitle, BodyBold } from '../../../../components/Text';
import { Col, SecondaryButton, PrimaryButton } from '../../../../components/Blocks';
import DjCard from '../../components/blocks/DJCard';
import { EVENT_GIGS } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import EmptyPage from '../../../../components/common/EmptyPage';
import { gigStates, eventStates } from '../../../../constants/constants';

const EventGigs = React.forwardRef((props, ref) => {
    const {
        theEvent = {},
        loading: loadingEvent,
        translate,
        currency,
        match,
        notifications,
        setActiveChat,
    } = props;
    const { status, organizer } = theEvent;
    const { data = {}, loading: loadingGigs, refetch } = useQuery(EVENT_GIGS, {
        skip: !theEvent.id,
        fetchPolicy: 'cache-and-network',
        variables: {
            id: theEvent.id,
            hash: theEvent.hash,
            currency,
        },
    });

    const [refetchTries, setRefetchTries] = useState(data?.event ? 5 : 0);
    const history = useHistory();

    const loading = refetchTries < 15 || loadingEvent || loadingGigs;

    let gigs = data.event ? data.event.gigs : [];
    gigs = gigs
        .filter((g) => g.status !== 'LOST')
        .map((g) => ({
            ...g,
            hasMessage: notifications[g.id] && notifications[g.id].read < notifications[g.id].total,
        }));

    // event polling for djs
    useEffect(() => {
        let timeoutRef = null;

        if (status !== eventStates.CONFIRMED) {
            if (refetchTries < 15 && !gigs?.length) {
                timeoutRef = setTimeout(() => {
                    refetch();
                    setRefetchTries((c) => c + 1);
                }, 1000);
            }
            // else {
            //     setRefetchTries(15);
            //     // keep polling every 10 second until we have 8 up to 20 times
            //     if (gigs.length < 8 && refetchTries < 20) {
            //         timeoutRef = setTimeout(() => {
            //             refetch();
            //             setRefetchTries((c) => c + 1);
            //         }, 10000);
            //     }
            // }
            return () => {
                clearTimeout(timeoutRef);
            };
        }
    }, [refetchTries, refetch, gigs, status]);

    if (gigs.length === 0 && loading) {
        return (
            <>
                <Title>{refetchTries > 5 ? 'Still looking for DJs' : 'Looking for DJs'}</Title>
                <Body>{'Wait a moment...'}</Body>
                <LoadingPlaceholder2 style={{ marginTop: 24 }} />
            </>
        );
    }

    if (theEvent && !organizer?.appMetadata?.emailVerified) {
        return <EmailNotVerifiedSection gigs={gigs} organizer={organizer} />;
    }

    if (!gigs.length) {
        return (
            <EmptyPage
                title="Still contacting DJs"
                message={
                    <>
                        We are still finding DJs for you. You can come back later.
                        <NotificationButton organizer={organizer} />
                    </>
                }
            />
        );
    }

    const statusPriority = {
        [gigStates.CONFIRMED]: 2,
        [gigStates.ACCEPTED]: 1,
    };

    const getPriority = (gig) => {
        const status = statusPriority[gig.status] || 0;
        return status + (gig.hasMessage ? 2 : 0);
    };

    return (
        <Col ref={ref}>
            <Title>{getTitle(status)}</Title>
            <Body>{getText(status)}</Body>
            <NotificationButton organizer={organizer} />

            <div data-cy="event-djs">
                {gigs
                    .sort((g1, g2) => getPriority(g2) - getPriority(g1))
                    .map((gig, idx) => (
                        <DjCard
                            hasMessage={gig.hasMessage}
                            key={gig.id}
                            idx={idx}
                            gig={gig}
                            translate={translate}
                            theEvent={theEvent}
                            onInitiateBooking={() =>
                                history.push(
                                    match.url + '/' + eventRoutes.checkout.replace(':gigId', gig.id)
                                )
                            }
                            onOpenChat={() => setActiveChat(gig.id)}
                        />
                    ))}
            </div>
            <Route
                path={match.path + '/' + eventRoutes.checkout}
                render={(props) => (
                    <PayForm
                        onClose={() => history.push(match.url + '/' + eventRoutes.overview)}
                        eventId={theEvent.id}
                        eventHash={theEvent.hash}
                        currency={currency}
                        {...props}
                    />
                )}
            />
        </Col>
    );
});

const getText = (status) => {
    switch (status) {
        case 'ACCEPTED':
            return 'Choose and book one of the DJs below. Remember quality follows price. If you have any questions, you can message the DJs. Once you have confirmed a DJ, you’ll be able to see additional information such as phone number.';
        case 'CONFIRMED':
            return 'Contact the DJ to make sure that all details are agreed upon.';
        default:
            return 'The DJs have not made any offers yet. In the meantime you can check out their profiles or message them. We’ll notify you by email when someone makes an offer or messages you. Once you have confirmed a DJ, you’ll be able to see additional information such as phone number.';
    }
};

const getTitle = (status) => {
    switch (status) {
        case 'CONFIRMED':
            return 'The DJ has been booked';
        default:
            return "So far, we've found these DJs for you";
    }
};

const Overview = (props) => {
    const { translate, setActiveChat } = useTranslate();
    const { theEvent, loading } = props;

    if (loading) {
        return <LoadingPlaceholder2 />;
    }
    if (theEvent && theEvent.status === 'FINISHED') {
        const { chosenGig } = theEvent;

        return (
            <Col>
                <HeaderTitle style={{ color: '#122b48' }}>Event is finished</HeaderTitle>
                <Body>
                    The event is finished, we hope you had a blast.
                    <br />
                    Remember to review the DJ that played at the event.
                </Body>
                {chosenGig && (
                    <DjCard
                        key={chosenGig.id}
                        idx={0}
                        gig={chosenGig}
                        translate={translate}
                        theEvent={theEvent}
                        onOpenChat={() => setActiveChat(chosenGig.id)}
                    />
                )}
            </Col>
        );
    }
    if (theEvent && theEvent.status === 'CANCELLED') {
        return (
            <Col>
                <HeaderTitle style={{ color: '#122b48' }}>Event cancelled</HeaderTitle>
                <Body>The event has been cancelled.</Body>
            </Col>
        );
    }

    return <EventGigs {...props} />;
};

const EmailNotVerifiedSection = ({ gigs, organizer }) => {
    const history = useHistory();
    const foundDjs = gigs.length;

    const navigateToRequirements = () => history.push(eventRoutes.requirements);

    const [request, { loading, data }] = useMutation(REQUEST_EMAIL_VERIFICATION);

    const resendLink = () => {
        request({
            variables: {
                email: organizer.email,
                redirectLink: window.location.href,
            },
        });
    };

    let text = `You
   need to verify your email <b>${organizer?.email}</b>, so you don't loose access to
   this page.`;

    if (foundDjs > 0) {
        text = `So far we've found ${foundDjs} ${foundDjs > 1 ? 'DJs' : 'DJ'} for you, but first you
       need to verify your email <b>${organizer?.email}</b>, so you don't loose access to
       this page.`;
    }

    return (
        <Col style={{ maxWidth: 500 }}>
            <Title>Verify your email</Title>
            <Body dangerouslySetInnerHTML={{ __html: text }} />
            <InputRow style={{ marginTop: '30px' }}>
                <SecondaryButton disabled={loading || data} onClick={resendLink}>
                    Resend link
                </SecondaryButton>
                <SecondaryButton onClick={navigateToRequirements}>Change email</SecondaryButton>
            </InputRow>
            {data && (
                <BodyBold style={{ marginTop: 12 }}>Email sent, remember to check spam</BodyBold>
            )}
        </Col>
    );
};

const NotificationButton = ({ organizer }) => {
    const { showPrompt, pushShouldBeEnabled } = usePushNotifications({ userId: organizer.id });

    if (!pushShouldBeEnabled) {
        return null;
    }

    return (
        <PrimaryButton onClick={showPrompt} style={{ maxWidth: '100%', width: 250, marginTop: 30 }}>
            Get notified about new DJs
        </PrimaryButton>
    );
};

export default Overview;
