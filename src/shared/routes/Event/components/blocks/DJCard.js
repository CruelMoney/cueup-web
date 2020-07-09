import React, { useState } from 'react';
import styled from 'styled-components';

import { Icon } from '@iconify/react';
import mailIcon from '@iconify/icons-ion/mail';
import phoneIcon from '@iconify/icons-ion/call';

import { NavLink } from 'react-router-dom';
import { useMutation } from 'react-apollo';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes, userRoutes, eventRoutes } from 'constants/locales/appRoutes';
import { ProFeature } from 'components/FormComponents';
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
import { SmallHeader, BodySmall, BodyBold, Body } from '../../../../components/Text';
import ConditionalWrap from '../../../../components/ConditionalWrap';
import Popup from '../../../../components/common/Popup';
import Chat from '../../../../components/common/Chat';
import EmptyPage from '../../../../components/common/EmptyPage';
import { DECLINE_DJ, EVENT_GIGS } from '../../gql';
import { ACTIVITY_TYPES, LogActivityInView } from '../../../../components/hooks/useLogActivity';
import lazyUser from '../../../User';

const hiddenEmail = '12345678@1234'.replace(/\w/g, '•') + '.com';
const hiddenNumber = '45 12 34 56 78'.replace(/\w/g, '•');

const DjCard = ({ style, idx, gig, theEvent, hasMessage, onOpenChat, onInitiateBooking }) => {
    const { translate } = useTranslate();

    const { dj, offer, status } = gig;
    if (!dj) {
        return null;
    }
    const { userMetadata = {}, appMetadata = {}, artistName, email } = dj;
    const { firstName, phone } = userMetadata;
    const { isPro } = appMetadata;
    let { bio } = userMetadata;
    bio = bio ? bio : '';
    const shouldTruncate = bio?.length > 100;
    const truncatedBio = shouldTruncate ? bio.substring(0, 100) + '...' : bio;
    const name = artistName || firstName;
    const showInfo = status === 'CONFIRMED' || isPro;
    const finished = theEvent.status === 'FINISHED';

    return (
        <LogActivityInView type={ACTIVITY_TYPES.GIG_VIEWED_BY_ORGANIZER} subjectId={gig.id}>
            <NavLink
                pointerEvents="auto"
                to={{
                    pathname: `${translate(appRoutes.user)}/${dj.permalink}/${userRoutes.overview}`,
                    state: { gigId: gig.id, dj },
                    search: `?gigId=${gig.id}&eventId=${theEvent.id}&hash=${theEvent.hash}`,
                }}
            >
                <Wrapper idx={idx} data-cy="event-dj" onMouseEnter={() => lazyUser.preload()}>
                    <Card style={style}>
                        <ImageWrapper>
                            <StyledImage src={dj.picture.path} />
                        </ImageWrapper>
                        <Content>
                            <RowWrap>
                                <ColLeft>
                                    <SmallHeader>
                                        {name}{' '}
                                        <ProFeature disabled small>
                                            Pro
                                        </ProFeature>
                                    </SmallHeader>
                                    <BodySmall
                                        style={{ wordBreak: 'break-word', marginBottom: '9px' }}
                                    >
                                        {truncatedBio}
                                    </BodySmall>
                                    <RowWrap>
                                        {!finished && (
                                            <SecondaryButton
                                                small
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
                                                {hasMessage && (
                                                    <div className="notification-bubble">!</div>
                                                )}
                                            </SecondaryButton>
                                        )}

                                        {finished ? (
                                            <SecondaryButton data-cy="dj-profile-button" small>
                                                See profile
                                            </SecondaryButton>
                                        ) : (
                                            <TeritaryButton data-cy="dj-profile-button" small>
                                                See profile
                                            </TeritaryButton>
                                        )}
                                    </RowWrap>
                                </ColLeft>
                                <RightCol>
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
                                        >
                                            <InfoPill>
                                                <Icon
                                                    icon={mailIcon}
                                                    style={{ fontSize: '15px' }}
                                                    color="#98A4B3"
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
                                        >
                                            <InfoPill>
                                                <Icon
                                                    icon={phoneIcon}
                                                    style={{ fontSize: '15px' }}
                                                    color="#98A4B3"
                                                />
                                                <span>{showInfo ? phone : hiddenNumber}</span>
                                            </InfoPill>
                                        </ConditionalWrap>
                                    )}
                                </RightCol>
                            </RowWrap>
                            <div style={{ flex: 1 }} />
                            <Hr />

                            <Offer
                                {...offer}
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

    return (
        <OfferRow middle>
            <OfferTextWrapper>
                {!confirmed && (
                    <OfferText data-cy="offer-price" muted={!offer}>
                        {offer ? offer.formatted : 'No offer yet'}
                    </OfferText>
                )}
                {tempPaidIndicator && <OfferText muted={true}>Paid and confirmed</OfferText>}
                {confirmed && !tempPaidIndicator && (
                    <>
                        <OfferText data-cy="offer-price" muted={!offer}>
                            {amountPaid?.formatted}
                        </OfferText>
                        <OfferText muted={true}>Paid and confirmed</OfferText>
                        {amountLeft?.amount ? (
                            <OfferText muted>{amountLeft.formatted} remaining</OfferText>
                        ) : null}
                    </>
                )}
            </OfferTextWrapper>
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
                {['ACCEPTED'].includes(status) && (
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
                {['CONFIRMED', 'FINISHED'].includes(status) && (
                    <NavLink to={eventRoutes.review}>
                        <PrimaryButton>Review {name}</PrimaryButton>
                    </NavLink>
                )}
            </ButtonsRow>
        </OfferRow>
    );
};

const OfferTextWrapper = styled(Col)`
    margin-top: 24px;
`;

const Filler = styled.div`
    flex: 1;
    width: 100%;
    @media only screen and (max-width: 710px) {
        display: none;
    }
`;

const ButtonsRow = styled(Row)`
    margin-top: 24px;
    flex-wrap: wrap-reverse;
    justify-content: center;
`;

const OfferText = styled(BodyBold)`
    font-size: 18px;
    margin: 0;
    color: ${({ muted }) => (muted ? '#98A4B3' : '#122b48')};
`;

const OfferRow = styled(Row)`
    justify-content: center;
    flex-wrap: wrap;
`;

const ColLeft = styled(Col)`
    flex: 2;
    margin-bottom: 24px;
    min-width: 297px;
    margin-right: 15px;
    @media only screen and (max-width: 375px) {
        margin-right: 0px;
        min-width: 100%;
    }
`;

const RightCol = styled(Row)`
    flex-wrap: wrap;
    margin-right: -9px;
    flex: 1;
    margin-bottom: 15px;
    justify-content: flex-end;
    @media only screen and (max-width: 375px) {
        justify-content: flex-start;
    }
`;

const ImageWrapper = styled.div`
    min-width: 214px;
    min-height: 200px;
    position: relative;
    width: 100%;
    flex: 1;
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
    min-height: 244px;
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
