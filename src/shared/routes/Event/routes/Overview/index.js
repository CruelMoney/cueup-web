import React, { useState, useEffect, useMemo } from 'react';
import { useQuery, useMutation } from '@apollo/client';
import { useHistory, Route, useRouteMatch } from 'react-router';
import Skeleton from 'react-loading-skeleton';
import Icon from '@iconify/react';
import starIcon from '@iconify/icons-ion/ios-star';
import cancelledIcon from '@iconify/icons-ion/ios-close-circle';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';
import useTranslate from 'components/hooks/useTranslate';
import { InputRow } from 'components/FormComponents';
import { eventRoutes } from 'constants/locales/appRoutes';
import { REQUEST_EMAIL_VERIFICATION } from 'components/gql';
import usePushNotifications from 'components/hooks/usePushNotifications';
import PayForm from 'components/common/PayForm';
import Pagination from 'components/Pagination';
import ErrorMessage from 'components/common/ErrorMessage';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import {
    Title,
    Body,
    HeaderTitle,
    BodyBold,
    PageTitle,
    H2,
    H3,
    TitleClean,
} from '../../../../components/Text';
import { Col, SecondaryButton, PrimaryButton, Hr, Row } from '../../../../components/Blocks';
import DjCard, { PotentialDjCard } from '../../components/blocks/DJCard';
import { EVENT_GIGS } from '../../gql';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import EmptyPage from '../../../../components/common/EmptyPage';
import { gigStates, eventStates } from '../../../../constants/constants';

const EventGigs = React.forwardRef((props, ref) => {
    const {
        theEvent = {},
        loading: loadingEvent,
        translate,
        match,
        emailVerified,
        notifications,
        setActiveChat,
        data,
        loadingGigs,
        refetch,
    } = props;
    const { status, organizer } = theEvent;

    const [refetchTries, setRefetchTries] = useState(data?.event ? 5 : 0);
    const history = useHistory();

    const loading = refetchTries < 15 || loadingEvent || loadingGigs;

    const { potentialDjs } = data?.event || {};

    const gigs = useMemo(() => {
        let res = data.event ? data.event.gigs : [];
        res = res
            .filter((g) => g.status !== 'LOST')
            .map((g) => ({
                ...g,
                hasMessage:
                    notifications[g.id] && notifications[g.id].read < notifications[g.id].total,
            }));
        return res;
    }, [data, notifications]);

    // event polling for djs
    useEffect(() => {
        let timeoutRef = null;

        if (status !== eventStates.CONFIRMED) {
            if (refetchTries < 15 && !gigs?.length && !potentialDjs?.length) {
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
    }, [refetchTries, refetch, gigs, status, potentialDjs]);

    if (theEvent && !emailVerified) {
        return <EmailNotVerifiedSection gigs={gigs} organizer={organizer} />;
    }

    if (gigs.length === 0 && loading) {
        return (
            <>
                <TitleClean>
                    {refetchTries > 5 ? 'Still looking for DJs' : 'Looking for DJs'}
                </TitleClean>
                <Body>{'Wait a moment...'}</Body>
                <Skeleton
                    height={100}
                    style={{
                        marginTop: 24,
                    }}
                />
            </>
        );
    }

    if (!gigs.length) {
        return (
            <EmptyPage
                title="Still contacting DJs"
                message={
                    <>
                        We are still finding DJs for you. {'\n'}Come back later.
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
            <TitleClean style={{ marginBottom: 0 }}>{getTitle(status)}</TitleClean>
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
        </Col>
    );
});

const getTitle = (status) => {
    switch (status) {
        case 'CONFIRMED':
            return 'The DJ has been booked';
        default:
            return "So far, we've found these DJs for you";
    }
};

const FinishedEvent = () => {
    return (
        <Col center middle style={{ marginTop: 100 }}>
            <Icon icon={starIcon} style={{ fontSize: 30, marginBottom: 12, color: '#31DAFF' }} />
            <H3 small style={{ textAlign: 'center' }}>
                Event is finished
            </H3>
            <Body center>
                The event is finished, we hope you had a blast.
                <br />
                Remember to review the DJ.
            </Body>
            <NavLink to="review">
                <PrimaryButton style={{ marginTop: 15 }}>Review</PrimaryButton>
            </NavLink>
        </Col>
    );
};

const CancelledEvent = () => {
    return (
        <Col center middle style={{ marginTop: 100 }}>
            <Icon
                icon={cancelledIcon}
                style={{ fontSize: 30, marginBottom: 12, color: 'rgb(244, 67, 54)' }}
            />
            <H3 small style={{ textAlign: 'center' }}>
                Event cancelled
            </H3>
            <Body center>You have cancelled the event.</Body>
        </Col>
    );
};

const Overview = (props) => {
    const { loading } = props;

    if (loading) {
        return <LoadingPlaceholder2 />;
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

    const text = `You
   need to verify your email <b>${organizer?.email}</b>, so you don't loose access to
   this page.`;

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
        <SecondaryButton
            onClick={showPrompt}
            style={{ maxWidth: '100%', width: 250, marginTop: 30 }}
        >
            Get notified about new DJs
        </SecondaryButton>
    );
};

const EventOverview = (props) => {
    const { theEvent, currency } = props;
    const match = useRouteMatch();
    const history = useHistory();
    const [pagination, setPagination] = useState({
        page: 1,
    });

    const { data = {}, loading: loadingGigs, refetch, error } = useQuery(EVENT_GIGS, {
        fetchPolicy: 'cache-and-network',
        variables: {
            id: theEvent.id,
            hash: theEvent.hash,
            currency,
            page: pagination.page,
        },
        onError: (error) => {
            throw error;
        },
    });

    const emailVerified = theEvent?.organizer?.appMetadata?.emailVerified;

    if (theEvent?.status === eventStates.CANCELLED) {
        return <CancelledEvent />;
    }
    if (theEvent?.status === eventStates.FINISHED) {
        return <FinishedEvent />;
    }

    return (
        <>
            <PageTitle hideMobile>DJ offers</PageTitle>
            <Hr style={{ marginBottom: 30 }} />
            <ErrorMessageApollo error={error} />
            <Overview
                {...props}
                data={data}
                emailVerified={emailVerified}
                loadingGigs={loadingGigs}
                refetch={refetch}
            />
            {[
                eventStates.ACCEPTED,
                eventStates.NO_MATCHES,
                eventStates.INITIAL,
                eventStates.OFFERING,
            ].includes(theEvent?.status) &&
                emailVerified && (
                    <OtherGreatDJs
                        theEvent={theEvent}
                        data={data}
                        loadingGigs={loadingGigs}
                        refetch={refetch}
                        pagination={pagination}
                        setPagination={setPagination}
                    />
                )}
            <Route
                path={match.path.replace('overview', '') + eventRoutes.checkout}
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
        </>
    );
};

const OtherGreatDJs = ({ theEvent, data, pagination, setPagination }) => {
    let title = 'Other great DJs';
    const { location } = theEvent;
    const { potentialDjs } = data?.event || {};
    const { pageInfo, edges } = potentialDjs || {};

    if (location?.name) {
        title = `${title} in ${location.name?.split(',')[0]}`;
    }

    if (!edges?.length) {
        return null;
    }

    return (
        <Col style={{ marginTop: 120 }}>
            <TitleClean small style={{ marginBottom: 0 }}>
                {title}
            </TitleClean>
            <Body>Send your event details to get in contact.</Body>
            <SearchList>
                {edges.map((dj, idx) => (
                    <PotentialDjCard
                        key={dj.id}
                        idx={idx}
                        dj={dj}
                        theEvent={theEvent}
                        page={pagination.page}
                    />
                ))}
            </SearchList>
            {pageInfo && (
                <Row style={{ marginTop: 30 }}>
                    <Pagination
                        activePage={pagination.page}
                        ellipsisBuffer={2}
                        onPageChange={(page) => {
                            setPagination((pp) => ({ ...pagination, ...pp, page }));
                        }}
                        totalPages={pageInfo.totalPages}
                    />
                </Row>
            )}
        </Col>
    );
};

const SearchList = styled.ul`
    padding: 0;
    list-style: none;
    > li {
    }
`;

export default EventOverview;
