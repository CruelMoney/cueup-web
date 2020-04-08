import React, { useState, useEffect } from 'react';
import { useQuery } from 'react-apollo';
import { captureException } from '@sentry/core';
import useTranslate from 'components/hooks/useTranslate';
import { useServerContext } from 'components/hooks/useServerContext';
import { Title, Body, HeaderTitle } from '../../../../components/Text';
import { Col } from '../../../../components/Blocks';
import DjCard from '../../components/blocks/DJCard';
import { EVENT_GIGS } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import { notificationService } from '../../../../utils/NotificationService';
import EmptyPage from '../../../../components/common/EmptyPage';
import { gigStates } from '../../../../constants/constants';

const EventGigs = React.forwardRef(
    ({ theEvent = {}, loading: loadingEvent, translate, currency }, ref) => {
        const { environment } = useServerContext();

        const { status } = theEvent;

        const [gigMessages, setGigMessages] = useState([]);
        const { data = {}, loading: loadingGigs } = useQuery(EVENT_GIGS, {
            skip: !theEvent.id,
            variables: {
                id: theEvent.id,
                hash: theEvent.hash,
                currency,
            },
        });

        useEffect(() => {
            const connect = async () => {
                try {
                    console.log('init');

                    notificationService.init(theEvent.organizer.id, environment.CHAT_DOMAIN);
                    const res = await notificationService.getChatStatus();
                    console.log({ res });
                    setGigMessages(res);
                } catch (error) {
                    console.log(error);
                    captureException(error);
                }
            };
            if (theEvent && theEvent.organizer) {
                connect();
                return () => {
                    console.log('dispose');
                    notificationService.dispose();
                };
            }
        }, [theEvent, environment]);

        const readRoom = () => setGigMessages([]);

        const loading = loadingEvent || loadingGigs;

        if (loading) {
            return <LoadingPlaceholder2 />;
        }

        let gigs = data.event ? data.event.gigs : [];
        gigs = gigs
            .filter((g) => g.status !== 'LOST')
            .map((g) => {
                g.hasMessage =
                    gigMessages[g.id] && gigMessages[g.id].read < gigMessages[g.id].total;
                return g;
            });

        if (!loading && gigs.length === 0) {
            return (
                <EmptyPage
                    title="No DJs"
                    message={'We are still finding DJs for you, come back later.'}
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
