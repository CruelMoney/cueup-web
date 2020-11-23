import React, { useState } from 'react';
import styled from 'styled-components';

import { Icon, InlineIcon } from '@iconify/react';
import mailIcon from '@iconify/icons-ion/mail';
import phoneIcon from '@iconify/icons-ion/call';
import pinIcon from '@iconify/icons-ion/location-sharp';
import membersinceIcon from '@iconify/icons-ion/md-contact';

import { NavLink } from 'react-router-dom';
import { useMutation } from '@apollo/client';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes, userRoutes, eventRoutes } from 'constants/locales/appRoutes';
import { ProFeature } from 'components/FormComponents';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import Tooltip from 'components/Tooltip';
import {
    Col,
    keyframeFadeIn,
    Row,
    SecondaryButton,
    TeritaryButton,
    Hr,
    PrimaryButton,
    SmartButton,
    RowWrap,
    InfoPill,
    NotificationBubble,
} from '../../../../components/Blocks';
import GracefullImage from '../../../../components/GracefullImage';
import { SmallHeader, BodySmall, BodyBold, Body, H3 } from '../../../../components/Text';
import ConditionalWrap from '../../../../components/ConditionalWrap';
import { DECLINE_DJ, EVENT_GIGS, SEND_EVENT_TO_DJ } from '../../gql';
import { ACTIVITY_TYPES, LogActivityInView } from '../../../../components/hooks/useLogActivity';
import lazyUser from '../../../User';

const hiddenEmail = '12345678@1234'.replace(/\w/g, '•') + '.com';
const hiddenNumber = '45 12 34 56 78'.replace(/\w/g, '•');

export const PotentialDjCard = ({ dj, idx, theEvent, page }) => {
    const { translate } = useTranslate();

    const { id, userMetadata = {}, appMetadata = {}, artistName, playingLocation } = dj;
    const { firstName, bio } = userMetadata;
    const { isPro, createdAt } = appMetadata;

    const name = artistName || firstName;

    const [sendEvent, { loading, error }] = useMutation(SEND_EVENT_TO_DJ, {
        variables: { eventId: theEvent.id, djId: id },
        awaitRefetchQueries: true,
        refetchQueries: [
            {
                query: EVENT_GIGS,
                variables: {
                    page,
                    id: theEvent?.id,
                    hash: theEvent?.hash,
                },
            },
        ],
    });

    return (
        <NavLink
            pointerEvents="auto"
            target="_blank"
            rel="noopener noreferrer"
            to={{
                pathname: `${translate(appRoutes.user)}/${dj.permalink}/${userRoutes.overview}`,
                //  state: { gigId: gig.id, dj },
                search: `?potentialDj=true&eventId=${theEvent.id}&hash=${theEvent.hash}`,
            }}
        >
            <Wrapper idx={idx} data-cy="event-dj" onMouseEnter={() => lazyUser.preload()}>
                <Card>
                    <Header dj={dj} showInfo={false} />
                </Card>

                <Shadow />
            </Wrapper>
        </NavLink>
    );
};

const SmallInfo = ({ createdAt, playingLocation }) => {
    const memberSince = new Date(createdAt).getFullYear();

    return (
        <Row>
            <BodySmall>
                <InlineIcon icon={membersinceIcon} /> Member since {memberSince}
            </BodySmall>

            {playingLocation && (
                <BodySmall style={{ marginLeft: 6 }}>
                    <InlineIcon icon={pinIcon} /> {playingLocation.name}
                </BodySmall>
            )}
        </Row>
    );
};

const Header = ({ dj, showInfo }) => {
    const { userMetadata = {}, appMetadata = {}, artistName, email, playingLocation } = dj;
    const { firstName, phone, bio } = userMetadata;
    const { isPro, createdAt } = appMetadata;

    const name = artistName || firstName;

    return (
        <RowWrap middle style={{ padding: '0.75em' }}>
            <ImageWrapper style={{ marginRight: '0.5em', marginBottom: '0.5em' }}>
                <StyledImage src={dj.picture.path} />
            </ImageWrapper>
            <Col style={{ marginBottom: '0.5em' }}>
                <H3 small style={{ marginBottom: 4 }}>
                    {name}{' '}
                    {isPro && (
                        <ProFeature disabled small>
                            Pro
                        </ProFeature>
                    )}
                </H3>
                <SmallInfo createdAt={createdAt} playingLocation={playingLocation} />
                <ContactRow style={{ marginTop: 4 }}>
                    {email && (
                        <ConditionalWrap
                            condition={showInfo}
                            wrap={(children) => (
                                <span>
                                    <a
                                        title={'Send an email to ' + firstName}
                                        href={'mailto:' + email}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {children}
                                    </a>
                                </span>
                            )}
                            elseWrap={(children) => (
                                <Tooltip content={'Email becomes visible if you book this DJ.'}>
                                    {({ ref, close, open }) => (
                                        <span ref={ref} onMouseEnter={open} onMouseLeave={close}>
                                            {children}
                                        </span>
                                    )}
                                </Tooltip>
                            )}
                        >
                            <InfoPill active={showInfo}>
                                <Icon icon={mailIcon} style={{ fontSize: '15px' }} />
                                <span>{showInfo ? email : hiddenEmail}</span>
                            </InfoPill>
                        </ConditionalWrap>
                    )}
                    {phone && (
                        <ConditionalWrap
                            condition={showInfo}
                            wrap={(children) => (
                                <span>
                                    <a
                                        title={'Call ' + firstName}
                                        href={'tel:' + phone}
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        {children}
                                    </a>
                                </span>
                            )}
                            elseWrap={(children) => (
                                <Tooltip
                                    content={'Phone number becomes visible if you book this DJ.'}
                                >
                                    {({ ref, close, open }) => (
                                        <span ref={ref} onMouseEnter={open} onMouseLeave={close}>
                                            {children}
                                        </span>
                                    )}
                                </Tooltip>
                            )}
                        >
                            <InfoPill active={showInfo}>
                                <Icon icon={phoneIcon} style={{ fontSize: '15px' }} />
                                <span>{showInfo ? phone : hiddenNumber}</span>
                            </InfoPill>
                        </ConditionalWrap>
                    )}
                </ContactRow>
            </Col>
            <div style={{ flex: 1 }} />
            <SecondaryButton style={{ margin: '0.75em 0' }} data-cy="dj-profile-button" small>
                View profile
            </SecondaryButton>
        </RowWrap>
    );
};

const DjCard = ({ style, idx, gig, theEvent, hasMessage, onOpenChat, onInitiateBooking }) => {
    const { translate } = useTranslate();

    const { dj, offer, status } = gig;
    if (!dj) {
        return null;
    }
    const { userMetadata = {}, appMetadata = {}, artistName, email, playingLocation } = dj;
    const { firstName, phone, bio } = userMetadata;
    const { isPro, createdAt } = appMetadata;

    const name = artistName || firstName;
    const showInfo = status === 'CONFIRMED' || isPro;

    return (
        <LogActivityInView type={ACTIVITY_TYPES.GIG_VIEWED_BY_ORGANIZER} subjectId={gig.id}>
            <NavLink
                target="_blank"
                rel="noopener noreferrer"
                pointerEvents="auto"
                to={{
                    pathname: `${translate(appRoutes.user)}/${dj.permalink}/${userRoutes.overview}`,
                    state: { gigId: gig.id, dj },
                    search: `?gigId=${gig.id}&eventId=${theEvent.id}&hash=${theEvent.hash}`,
                }}
            >
                <Wrapper idx={idx} data-cy="event-dj" onMouseEnter={() => lazyUser.preload()}>
                    <Card style={style}>
                        <Header dj={dj} showInfo={showInfo} />

                        <Hr />

                        <Offer
                            {...offer}
                            hasMessage={hasMessage}
                            onOpenChat={onOpenChat}
                            theEvent={theEvent}
                            gig={gig}
                            translate={translate}
                            name={name}
                            initiateBooking={onInitiateBooking}
                        />
                    </Card>

                    <Shadow />
                </Wrapper>
            </NavLink>
        </LogActivityInView>
    );
};

const Offer = ({
    name,
    offer,
    amountPaid,
    amountLeft,
    translate,
    gig,
    theEvent,
    initiateBooking,
    hasMessage,
    onOpenChat,
}) => {
    const [decline, { loading }] = useMutation(DECLINE_DJ, {
        variables: {
            gigId: gig.id,
            hash: theEvent.hash,
        },
        awaitRefetchQueries: true,
        refetchQueries: [
            {
                query: EVENT_GIGS,
                variables: {
                    id: theEvent.id,
                    hash: theEvent.hash,
                },
            },
        ],
    });

    // tempPaidIndicator is a client side variable set true after payment
    const { status, tempPaidIndicator } = gig;

    const confirmed = ['CONFIRMED'].includes(status);

    const accepted = ['ACCEPTED'].includes(status);

    return (
        <OfferRow middle>
            <Col style={{ marginLeft: 4, flexGrow: 1 }}>
                {!confirmed && (
                    <OfferText data-cy="offer-price" greyed={!offer}>
                        {offer ? offer.formatted : 'No offer yet'}
                    </OfferText>
                )}
                {tempPaidIndicator && <OfferText greyed={true}>Paid and confirmed</OfferText>}
                {confirmed && !tempPaidIndicator && (
                    <>
                        <OfferText data-cy="offer-price" greyed={!offer}>
                            {amountPaid?.formatted}
                        </OfferText>
                        <OfferText greyed={true}>Paid and confirmed</OfferText>
                        {amountLeft?.amount ? (
                            <OfferText greyed>{amountLeft.formatted} remaining</OfferText>
                        ) : null}
                    </>
                )}
            </Col>
            <ButtonsRow>
                {['ACCEPTED', 'REQUESTED'].includes(status) && (
                    <SmartButton
                        loading={loading}
                        onClick={decline}
                        warning={translate('decline-warning')}
                        level="tertiary"
                        style={{
                            pointerEvents: 'all',
                        }}
                    >
                        Remove DJ
                    </SmartButton>
                )}
                {!['FINISHED'].includes(status) && (
                    <SmartButton
                        level={accepted ? 'secondary' : 'primary'}
                        data-cy="message-dj-button"
                        style={{
                            overflow: 'visible',
                            pointerEvents: 'all',
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            onOpenChat();
                        }}
                    >
                        {hasMessage && (
                            <NotificationBubble
                                border
                                style={{ marginLeft: 0, marginRight: '0.5em', top: -2 }}
                            >
                                !
                            </NotificationBubble>
                        )}
                        Message
                    </SmartButton>
                )}
                {accepted && (
                    <PrimaryButton
                        style={{
                            pointerEvents: 'all',
                        }}
                        data-cy="book-dj-button"
                        onClick={(e) => {
                            e.preventDefault();
                            initiateBooking();
                        }}
                    >
                        Book {name}
                    </PrimaryButton>
                )}
                {['FINISHED'].includes(status) && (
                    <NavLink to={eventRoutes.review}>
                        <PrimaryButton>Review {name}</PrimaryButton>
                    </NavLink>
                )}
            </ButtonsRow>
        </OfferRow>
    );
};

const Filler = styled.div`
    flex: 1;
    width: 100%;
    @media only screen and (max-width: 710px) {
        display: none;
    }
`;

const ButtonsRow = styled(Row)`
    flex-wrap: wrap-reverse;
    justify-content: flex-end;
    flex-grow: 1;
    > * {
        margin: 4px !important;
    }
`;

const OfferText = styled(BodyBold)`
    font-size: 18px;
    margin: 6px 0;
    color: ${({ muted }) => (muted ? '#98A4B3' : '#122b48')};
    @media only screen and (max-width: 710px) {
        text-align: center;
    }
`;

const OfferRow = styled(RowWrap)`
    padding: 0.75em;
    margin: 0 -4px;
`;

const ContactRow = styled(Row)`
    > * {
        margin-right: 4px;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    min-width: 80px;
    min-height: 80px;
    max-width: 80px;
    border-radius: 50%;
    overflow: hidden;
    background-color: #f7f9fc;
    border: 0.5px solid #ebebeb;
    :before {
        content: '';
        display: block;
        padding-right: 100%;
        position: relative;
    }
`;
const StyledImage = styled(GracefullImage)`
    object-fit: cover;
    width: 100%;
    height: 100%;
    position: absolute;
`;

const Wrapper = styled(Col)`
    position: relative;
    margin-top: 30px;
    width: 100%;
    opacity: 0;
    animation: ${keyframeFadeIn} 400ms ease forwards;
    animation-delay: ${({ idx }) => idx * 150}ms;
`;

const Card = styled.div`
    display: flex;
    overflow: hidden;
    flex-direction: column;
    border-radius: 4px;
    background: #fff;
    z-index: 1;
    flex: 1;
`;

const Shadow = styled.div`
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 15px;
    left: 10px;
    bottom: 10px;
    right: 10px;
`;

export default DjCard;
