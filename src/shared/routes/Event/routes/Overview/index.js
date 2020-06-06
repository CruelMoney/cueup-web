import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { useHistory, Route } from 'react-router';
import useTranslate from 'components/hooks/useTranslate';
import { InputRow } from 'components/FormComponents';
import { eventRoutes } from 'constants/locales/appRoutes';
import { REQUEST_EMAIL_VERIFICATION } from 'components/gql';
import usePushNotifications from 'components/hooks/usePushNotifications';
import Popup from 'components/common/Popup';
import PayForm from 'components/common/PayForm';
import { Title, Body, HeaderTitle, BodyBold } from '../../../../components/Text';
import { Col, SecondaryButton, PrimaryButton } from '../../../../components/Blocks';
import DjCard from '../../components/blocks/DJCard';
import { EVENT_GIGS } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { useNotifications } from '../../../../utils/NotificationService';
import EmptyPage from '../../../../components/common/EmptyPage';
import { gigStates } from '../../../../constants/constants';

const EventGigs = React.forwardRef(
    ({ theEvent = {}, loading: loadingEvent, translate, currency, match }, ref) => {
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
        const [notifications, clearNotifications] = useNotifications({
            userId: organizer.id,
        });

        const readRoom = () => clearNotifications();

        const loading = refetchTries < 15 || loadingEvent || loadingGigs;

        // event polling for djs
        useEffect(() => {
            if (refetchTries < 15 && !data.event) {
                setTimeout(() => {
                    refetch();
                    setRefetchTries((c) => c + 1);
                }, 1000);
            } else {
                setRefetchTries(15);
            }
        }, [refetchTries, refetch, data]);

        let gigs = data.event ? data.event.gigs : [];
        gigs = gigs
            .filter((g) => g.status !== 'LOST')
            .map((g) => {
                g.hasMessage =
                    notifications[g.id] && notifications[g.id].read < notifications[g.id].total;
                return g;
            });

        if (gigs.length === 0 && loading) {
            return (
                <>
                    <Title>{refetchTries > 3 ? 'Still looking for DJs' : 'Looking for DJs'}</Title>
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
                                onOpenChat={readRoom}
                                key={gig.id}
                                idx={idx}
                                gig={gig}
                                translate={translate}
                                theEvent={theEvent}
                                onInitiateBooking={() =>
                                    history.push(
                                        match.url +
                                            '/' +
                                            eventRoutes.checkout.replace(':gigId', gig.id)
                                    )
                                }
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
    }
);

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
    const { translate } = useTranslate();
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
    const foundDjs = gigs.length || 1;

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

    return (
        <Col style={{ maxWidth: 500 }}>
            <Title>Verify your email</Title>
            <Body>
                So far we've already found {foundDjs} {foundDjs > 1 ? 'DJs' : 'DJ'} for you, but
                first you need to verify your email <b>{organizer?.email}</b>, so you don't so you
                don't loose access to this page.
            </Body>
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
