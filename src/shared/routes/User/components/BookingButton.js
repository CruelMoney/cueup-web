import React, { useState, useMemo } from 'react';
import { useQuery } from 'react-apollo';
import { NavLink, useRouteMatch, useHistory, Route } from 'react-router-dom';
import queryString from 'query-string';
import { appRoutes, userRoutes, eventRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { CTAButton } from '../../../components/Sidebar';
import PayForm from '../../../components/common/PayForm.js';
import Popup from '../../../components/common/Popup';
import { GIG } from '../gql';
import { LoadingIndicator } from '../../../components/Blocks';
import Chat from '../../../components/common/Chat';
import EmptyPage from '../../../components/common/EmptyPage';

const BookingButton = ({ user, gig, event, hash, offer, showPaymentForm }) => {
    const { translate } = useTranslate();
    const [showPopup, setShowPopup] = useState(false);

    const canBePaid = gig && gig.offer && gig.status === 'ACCEPTED' && event.status === 'ACCEPTED';

    if (canBePaid) {
        return (
            <>
                <CTAButton data-cy="profile-cta" onClick={() => showPaymentForm(true)}>
                    BOOK {offer.offer.formatted}
                </CTAButton>
            </>
        );
    }

    const isChosenGig = event && event.chosenGig && event.chosenGig.id === gig.id;

    const canBeReviewd = isChosenGig && ['FINISHED'].includes(event.status) && !event.review;

    if (canBeReviewd) {
        return (
            <NavLink to={`${translate(appRoutes.event)}/${event.id}/${hash}/${eventRoutes.review}`}>
                <CTAButton data-cy="profile-cta">REVIEW</CTAButton>
            </NavLink>
        );
    }

    const canBeChatted =
        (event && event.organizer && ['ACCEPTED', 'OFFERING'].includes(event.status)) ||
        (isChosenGig && ['CONFIRMED'].includes(event.status));

    if (canBeChatted) {
        const { organizer } = event;
        return (
            <>
                <CTAButton data-cy="profile-cta" onClick={() => setShowPopup(true)}>
                    SEND MESSAGE
                </CTAButton>
                <Popup noPadding showing={showPopup} onClickOutside={() => setShowPopup(false)}>
                    <Chat
                        showPersonalInformation={false}
                        eventId={event.id}
                        receiver={{
                            id: user.id,
                            name: user.userMetadata.firstName,
                            image: user.picture.path,
                        }}
                        sender={{
                            id: organizer.id,
                            name: organizer.userMetadata.firstName,
                            image: organizer.picture.path,
                        }}
                        chatId={gig.id}
                        placeholder={<EmptyPage title="No messages" />}
                    />
                </Popup>
            </>
        );
    }

    return (
        <NavLink to={userRoutes.booking}>
            <CTAButton data-cy="booking-button">REQUEST BOOKING</CTAButton>
        </NavLink>
    );
};

const Wrapper = (props) => {
    const { location, user, currency } = props;
    const match = useRouteMatch();
    const history = useHistory();

    // check for gigId, and save even though url changes
    const { gigId, hash } = useMemo(() => {
        return queryString.parse(location.search);
    }, []);

    const { data = {}, loading } = useQuery(GIG, {
        skip: !gigId || !hash,
        variables: {
            id: gigId,
            hash: hash,
        },
    });

    if (!user) {
        return null;
    }

    if (loading) {
        return (
            <CTAButton disabled data-cy="profile-cta">
                <LoadingIndicator />
            </CTAButton>
        );
    }

    if (user.isOwn) {
        return (
            <CTAButton
                onClick={() => window.alert('Are you trying to book yourself? 🧐')}
                data-cy="profile-cta"
            >
                REQUEST BOOKING
            </CTAButton>
        );
    }

    const { gig } = data;
    const event = gig ? gig.event : null;
    const { offer } = gig || {};

    console.log({ event });

    console.log(match.url + '/' + userRoutes.checkout.replace(':gigId', gigId));
    console.log(match.path + '/' + userRoutes.checkout);

    return (
        <>
            <BookingButton
                {...props}
                gig={gig}
                event={event}
                hash={hash}
                offer={offer}
                showPaymentForm={() =>
                    history.push(
                        match.url +
                            '/' +
                            userRoutes.checkout.replace(':gigId', gigId) +
                            location.search
                    )
                }
            />
            <Route
                path={match.path + '/' + userRoutes.checkout}
                render={(props) => (
                    <PayForm
                        onClose={() =>
                            history.push(match.url + '/' + userRoutes.overview + location.search)
                        }
                        currency={currency}
                        eventId={event?.id}
                        eventHash={hash}
                        {...props}
                    />
                )}
            />
        </>
    );
};

export default Wrapper;
