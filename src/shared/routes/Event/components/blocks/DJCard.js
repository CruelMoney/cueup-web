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
                // state: { gigId: gig.id, dj },
                // search: `?gigId=${gig.id}&eventId=${theEvent.id}&hash=${theEvent.hash}`,
            }}
        >
            <Wrapper idx={idx} data-cy="event-dj" onMouseEnter={() => lazyUser.preload()}>
                <Card>
                    <ImageWrapper>
                        <StyledImage src={dj.picture.path} />
                    </ImageWrapper>
                    <Content>
                        <ColLeft>
                            <H3 small style={{ marginBottom: 12 }}>
                                {name}{' '}
                                {isPro && (
                                    <ProFeature disabled small>
                                        Pro
                                    </ProFeature>
                                )}
                            </H3>
                            <SmallInfo createdAt={createdAt} playingLocation={playingLocation} />
                            <BodySmall numberOfLines={2} style={{ marginBottom: '9px' }}>
                                {bio}
                            </BodySmall>

                            <Row>
                                <TeritaryButton
                                    style={{ padding: 0, minWidth: 0, textAlign: 'left' }}
                                    data-cy="dj-profile-button"
                                    small
                                >
                                    View profile
                                </TeritaryButton>
                            </Row>
                        </ColLeft>
                        <div style={{ flex: 1 }} />
                        <Hr style={{ marginBottom: 20 }} />
                        <RowWrap right>
                            <SmartButton onClick={sendEvent} loading={loading}>
                                Send event details
                            </SmartButton>
                        </RowWrap>
                        <ErrorMessageApollo error={error} />
                    </Content>
                </Card>

                <Shadow />
            </Wrapper>
        </NavLink>
    );
};

const SmallInfo = ({ createdAt, playingLocation }) => {
    const memberSince = new Date(createdAt).getFullYear();

    return (
        <Row style={{ marginBottom: 6 }}>
            <BodySmall>
                <InlineIcon icon={membersinceIcon} /> Member since {memberSince}
            </BodySmall>

            {playingLocation && (
                <BodySmall style={{ marginLeft: 12 }}>
                    <InlineIcon icon={pinIcon} /> {playingLocation.name}
                </BodySmall>
            )}
        </Row>
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
                        <ImageWrapper style={{ minWidth: 270 }}>
                            <StyledImage src={dj.picture.path} />
                        </ImageWrapper>
                        <Content>
                            <ColLeft>
                                <H3 small>
                                    {name}{' '}
                                    {isPro && (
                                        <ProFeature disabled small>
                                            Pro
                                        </ProFeature>
                                    )}
                                </H3>
                                <SmallInfo
                                    createdAt={createdAt}
                                    playingLocation={playingLocation}
                                />
                                <Row>
                                    {email && (
                                        <ConditionalWrap
                                            condition={showInfo}
                                            wrap={(children) => (
                                                <a
                                                    title={'Send an email to ' + firstName}
                                                    href={'mailto:' + email}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {children}
                                                </a>
                                            )}
                                            elseWrap={(children) => (
                                                <Tooltip
                                                    content={
                                                        'Email will be visible after the booking is confirmed.'
                                                    }
                                                >
                                                    {({ ref, close, open }) => (
                                                        <span
                                                            ref={ref}
                                                            onMouseEnter={open}
                                                            onMouseLeave={close}
                                                        >
                                                            {children}
                                                        </span>
                                                    )}
                                                </Tooltip>
                                            )}
                                        >
                                            <InfoPill active={showInfo}>
                                                <Icon
                                                    icon={mailIcon}
                                                    style={{ fontSize: '15px' }}
                                                />
                                                <span>{showInfo ? email : hiddenEmail}</span>
                                            </InfoPill>
                                        </ConditionalWrap>
                                    )}
                                    {phone && (
                                        <ConditionalWrap
                                            condition={showInfo}
                                            wrap={(children) => (
                                                <a
                                                    title={'Call ' + firstName}
                                                    href={'tel:' + phone}
                                                    onClick={(e) => e.stopPropagation()}
                                                >
                                                    {children}
                                                </a>
                                            )}
                                            elseWrap={(children) => (
                                                <Tooltip
                                                    content={
                                                        'Phone number will be visible after the booking is confirmed.'
                                                    }
                                                >
                                                    {({ ref, close, open }) => (
                                                        <span
                                                            ref={ref}
                                                            onMouseEnter={open}
                                                            onMouseLeave={close}
                                                        >
                                                            {children}
                                                        </span>
                                                    )}
                                                </Tooltip>
                                            )}
                                        >
                                            <InfoPill active={showInfo}>
                                                <Icon
                                                    icon={phoneIcon}
                                                    style={{ fontSize: '15px' }}
                                                />
                                                <span>{showInfo ? phone : hiddenNumber}</span>
                                            </InfoPill>
                                        </ConditionalWrap>
                                    )}
                                </Row>

                                <BodySmall numberOfLines={2} style={{ marginBottom: '9px' }}>
                                    {bio}
                                </BodySmall>

                                <Row>
                                    <TeritaryButton
                                        style={{ padding: 0, minWidth: 0, textAlign: 'left' }}
                                        data-cy="dj-profile-button"
                                        small
                                    >
                                        View profile
                                    </TeritaryButton>
                                </Row>
                            </ColLeft>

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
                        </Content>
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
            <Col>
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
            <Filler />
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
                            position: 'relative',
                            overflow: 'visible',
                            pointerEvents: 'all',
                        }}
                        onClick={(e) => {
                            e.preventDefault();
                            onOpenChat();
                        }}
                    >
                        Message
                        {hasMessage && <div className="notification-bubble">!</div>}
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
    justify-content: center;
    > * {
        margin: 4px !important;
    }
`;

const OfferText = styled(BodyBold)`
    font-size: 18px;
    margin: 0;
    color: ${({ muted }) => (muted ? '#98A4B3' : '#122b48')};
`;

const OfferRow = styled(Row)`
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 24px;
`;

const ColLeft = styled(Col)`
    flex: 2;
    margin-bottom: 12px;
    min-width: 297px;
    margin-right: 15px;
    @media only screen and (max-width: 375px) {
        margin-right: 0px;
        min-width: 100%;
    }
`;

const ImageWrapper = styled.div`
    position: relative;
    min-width: 220px;
    min-height: 220px;
    flex-grow: 1;
    background-color: #f7f9fc;
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

const Content = styled(Col)`
    padding: 24px;
    flex: 2;
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
    flex-direction: row;
    border-radius: 4px;
    flex-wrap: wrap;
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
