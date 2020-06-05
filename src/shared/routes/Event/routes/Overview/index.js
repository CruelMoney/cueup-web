import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import useTranslate from 'components/hooks/useTranslate';
import { Title, Body, HeaderTitle } from '../../../../components/Text';
import { Col } from '../../../../components/Blocks';
import DjCard from '../../components/blocks/DJCard';
import { EVENT_GIGS } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { useNotifications } from '../../../../utils/NotificationService';
import EmptyPage from '../../../../components/common/EmptyPage';
import { gigStates } from '../../../../constants/constants';

const EventGigs = React.forwardRef(
    ({ theEvent = {}, loading: loadingEvent, translate, currency }, ref) => {
        const { status } = theEvent;

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

        const [notifications, clearNotifications] = useNotifications({
            userId: theEvent.organizer.id,
        });

        const readRoom = () => clearNotifications();

        const loading = refetchTries < 5 || loadingEvent || loadingGigs;

        // event polling for djs
        useEffect(() => {
            if (refetchTries < 5 && !data.event) {
                setTimeout(() => {
                    refetch();
                    setRefetchTries((c) => c + 1);
                }, 1000);
            } else {
                setRefetchTries(5);
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

        if (gigs.length === 0) {
            if (loading) {
                return (
                    <>
                        <Title>
                            {refetchTries > 3 ? 'Still looking for DJs' : 'Looking for DJs'}
                        </Title>
                        <Body>{'Wait a moment...'}</Body>
                        <LoadingPlaceholder2 style={{ marginTop: 24 }} />
                    </>
                );
            }

            return (
                <EmptyPage
                    title="Still contacting DJs"
                    message={
                        "We are still finding DJs for you, come back later. You'll receive an email once you get an offer."
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
                            />
                        ))}
                </div>
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
            return 'The DJs have not made any offers yet. In the meantime you check out their profiles or message them. We’ll notify you by email when someone makes an offer or messages you. Once you have confirmed a DJ, you’ll be able to see additional information such as phone number.';
    }
};

const getTitle = (status) => {
    switch (status) {
        case 'CONFIRMED':
            return 'The DJ has been booked';
        default:
            return "We've found these DJs for you";
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

export default Overview;
