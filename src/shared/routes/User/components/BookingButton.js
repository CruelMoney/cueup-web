import React, { useState, useMemo } from 'react';
import { useQuery } from '@apollo/client';
import { NavLink, useRouteMatch, useHistory } from 'react-router-dom';
import queryString from 'query-string';
import { useLocation } from 'react-router';
import { appRoutes, userRoutes, eventRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { useAppState } from 'components/hooks/useAppState';
import { CTAButton } from 'components/CTAButton';
import { GIG } from '../gql';
import { LoadingIndicator } from '../../../components/Blocks';

const InnerBookingButton = ({
    user,
    gig,
    event,
    hash,
    offer,
    showPaymentForm,
    buttonStyle,
    noIcon,
}) => {
    const { setAppState } = useAppState();
    const { translate } = useTranslate();
    const { search } = useLocation();
    const canBePaid = gig && gig.offer && gig.status === 'ACCEPTED' && event.status === 'ACCEPTED';

    const openChat = () => {
        setAppState({ showSideBarChat: true, activeChat: gig.id, activeEvent: { hash, ...event } });
    };

    if (canBePaid) {
        return (
            <>
                <CTAButton
                    noIcon={noIcon}
                    style={buttonStyle}
                    data-cy="profile-cta"
                    onClick={() => showPaymentForm(true)}
                >
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
                <CTAButton noIcon={noIcon} style={buttonStyle} data-cy="profile-cta">
                    REVIEW
                </CTAButton>
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
                <CTAButton
                    noIcon={noIcon}
                    style={buttonStyle}
                    data-cy="profile-cta"
                    onClick={openChat}
                >
                    SEND MESSAGE
                </CTAButton>
            </>
        );
    }

    return (
        <NavLink
            to={{
                pathname: `${translate(appRoutes.user)}/${user.permalink}/${userRoutes.booking}`,
                search,
            }}
        >
            <CTAButton noIcon={noIcon} style={buttonStyle} data-cy="booking-button">
                BOOK NOW
            </CTAButton>
        </NavLink>
    );
};

const BookingButton = (props) => {
    const { user, buttonStyle } = props;
    const location = useLocation();
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
            <CTAButton style={buttonStyle} disabled data-cy="profile-cta">
                <LoadingIndicator />
            </CTAButton>
        );
    }

    const { gig } = data;
    const event = gig ? gig.event : null;
    const { offer } = gig || {};

    return (
        <InnerBookingButton
            {...props}
            gig={gig}
            event={event}
            hash={hash}
            offer={offer}
            showPaymentForm={() =>
                history.push(
                    match.url + '/' + userRoutes.checkout.replace(':gigId', gigId) + location.search
                )
            }
        />
    );
};

export default BookingButton;
