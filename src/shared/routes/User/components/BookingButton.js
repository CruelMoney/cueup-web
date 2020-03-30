import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { NavLink } from 'react-router-dom';
import queryString from 'query-string';
import { appRoutes } from 'constants/locales/appRoutes';
import { eventRoutes } from 'routes/Event/routes';
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
                <CTAButton onClick={() => showPaymentForm(true)}>
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
                <CTAButton>REVIEW</CTAButton>
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
                <CTAButton onClick={() => setShowPopup(true)}>SEND MESSAGE</CTAButton>
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
        <NavLink to="booking">
            <CTAButton>REQUEST BOOKING</CTAButton>
        </NavLink>
    );
};

const Wrapper = (props) => {
    const { location, user } = props;
    const [showPopup, setShowPopup] = useState(false);

    // check for gigId
    const queries = queryString.parse(location.search);
    let { gigId, hash } = queries;

    if (!gigId && location && location.state && !hash) {
        gigId = location.state.gigId;
        hash = location.state.hash;
    }

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
            <CTAButton disabled>
                <LoadingIndicator />
            </CTAButton>
        );
    }

    if (user.isOwn) {
        return (
            <CTAButton onClick={() => window.alert('Are you trying to book yourself? 🧐')}>
                REQUEST BOOKING
            </CTAButton>
        );
    }

    const { gig } = data;
    const event = gig ? gig.event : null;
    const { offer } = gig || {};

    return (
        <>
            <BookingButton
                {...props}
                gig={gig}
                event={event}
                hash={hash}
                offer={offer}
                showPaymentForm={() => setShowPopup(true)}
            />
            {gig && (
                <Popup showing={showPopup} onClickOutside={() => setShowPopup(false)} noPadding>
                    <PayForm id={gig.id} offer={gig.offer} gig={gig} event={event} />
                </Popup>
            )}
        </>
    );
};

export default Wrapper;
