import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import calendarIcon from '@iconify/icons-ion/ios-calendar';
import locationIcon from '@iconify/icons-ion/ios-location';
import timeIcon from '@iconify/icons-ion/ios-time';
import { InlineIcon } from '@iconify/react';
import moment from 'moment-timezone';
import Skeleton from 'react-loading-skeleton';
import { useMutation } from '@apollo/client';
import { useLocation } from 'react-router';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { gigStates } from 'constants/constants';
import CancelationDeclinePopup from 'routes/Gig/components/CancelationDeclinePopup';
import Tooltip from 'components/Tooltip';
import { MY_ACTIVE_GIGS } from 'components/gql';
import { useAppState } from 'components/hooks/useAppState';
import {
    Col,
    keyframeFadeIn,
    Row,
    TeritaryButton,
    Hr,
    RowWrap,
    PillLarge,
    PrimaryButton,
    SecondaryButton,
    SmartButton,
    InfoPill,
    NotificationBubble,
} from '../../../components/Blocks';
import { SmallHeader, BodySmall, BodyBold, SmallBold, Body } from '../../../components/Text';
import { UNDO_PASS, UNDO_DECLINE, PASS_OPPORTUNITY } from '../gql';

const GigCard = ({ loading, style, idx, gig, opportunity, ...props }) => {
    const { event, offer, referred } = gig || {};
    const { id, start, name, location, description, duration, createdAt, organizer } = event || {};
    const { pathname } = useLocation();
    const { translate } = useTranslate();
    const [showDecline, setShowDecline] = useState(false);
    const [hasPassed, setHasPassed] = useState(false);
    const { notifications } = useAppState();

    const [passOpportunity, { loading: passing }] = useMutation(PASS_OPPORTUNITY, {
        variables: {
            id,
        },
        refetchQueries: [{ query: MY_ACTIVE_GIGS }],
        onCompleted: () => setHasPassed(true),
    });
    const [undoPassOpportunity, { loading: undoing }] = useMutation(UNDO_PASS, {
        variables: {
            id,
        },
        refetchQueries: [{ query: MY_ACTIVE_GIGS }],
        onCompleted: () => setHasPassed(false),
    });

    const [undoDecline, { loading: undoingDecline, data: undoData }] = useMutation(UNDO_DECLINE, {
        variables: {
            id: gig?.id,
        },
        refetchQueries: [{ query: MY_ACTIVE_GIGS }],
    });

    const hasUndoneDecline = !!undoData?.undoDeclineGig?.id;

    if (hasUndoneDecline) {
        return null;
    }

    if (hasPassed) {
        return <UndoPassCard undo={undoPassOpportunity} undoing={undoing} />;
    }

    const createdTimeAgo = loading ? null : moment(createdAt?.UTC).fromNow();

    const hasMessage =
        gig &&
        notifications &&
        notifications[gig.id] &&
        notifications[gig.id].read < notifications[gig.id].total;

    return (
        <Wrapper idx={idx} disabled={loading} {...props}>
            <Card
                style={style}
                to={{
                    pathname: `${translate(appRoutes.gig)}/${gig?.id}`,
                    state: {
                        comingFrom: pathname,
                    },
                }}
            >
                <Content>
                    <RowWrap style={{ marginBottom: '24px', width: '100%' }}>
                        <Col>
                            <Row middle style={{ marginBottom: 6 }}>
                                <SmallHeader>{name || <Skeleton width={200} />}</SmallHeader>
                                {referred && (
                                    <Tooltip text="This request is from your booking link, so you don't pay commission, and contact information is visible.">
                                        {({ ref, close, open }) => (
                                            <InfoPill
                                                active
                                                ref={ref}
                                                onMouseEnter={open}
                                                onMouseLeave={close}
                                                style={{
                                                    marginBottom: 0,
                                                    minWidth: 0,
                                                    marginLeft: 4,
                                                }}
                                            >
                                                Using booking link
                                            </InfoPill>
                                        )}
                                    </Tooltip>
                                )}
                            </Row>
                            <BodySmall>
                                {!loading ? (
                                    <>
                                        <span>Added {createdTimeAgo}</span>
                                    </>
                                ) : (
                                    <Skeleton width={50} />
                                )}
                                <span style={{ top: '2px', opacity: '0.5' }}>{'  •  '}</span>
                                <span>
                                    {organizer?.userMetadata?.firstName ||
                                        (loading ? <Skeleton width={50} /> : null)}
                                </span>
                            </BodySmall>
                        </Col>
                        <Filler />

                        {loading ? (
                            <Skeleton width={150} />
                        ) : (
                            <>
                                {location?.name && (
                                    <PillLarge>
                                        <InlineIcon
                                            icon={locationIcon}
                                            style={{ marginRight: 4, fontSize: '1.2em' }}
                                        />
                                        {location.name}
                                    </PillLarge>
                                )}
                                <PillLarge>
                                    <InlineIcon
                                        icon={calendarIcon}
                                        style={{ marginRight: 4, fontSize: '1.2em' }}
                                    />
                                    {start?.formattedDate}
                                </PillLarge>
                                {duration && (
                                    <PillLarge>
                                        <InlineIcon
                                            icon={timeIcon}
                                            style={{ marginRight: 4, fontSize: '1.2em' }}
                                        />
                                        {start?.formattedTime}, {duration?.formatted}
                                    </PillLarge>
                                )}
                            </>
                        )}
                    </RowWrap>
                    <BodySmall
                        numberOfLines={3}
                        style={{ wordBreak: 'break-word', marginBottom: '24px' }}
                    >
                        {description || (loading ? <Skeleton count={3} width={'100%'} /> : null)}
                    </BodySmall>

                    <Hr />

                    <Offer
                        {...offer}
                        loading={loading}
                        hasMessage={hasMessage}
                        gig={gig}
                        name={name}
                        opportunity={opportunity}
                        showDecline={(e) => {
                            e.preventDefault();
                            setShowDecline(true);
                        }}
                        passOpportunity={passOpportunity}
                        passing={passing}
                        undoingDecline={undoingDecline}
                        undoDecline={undoDecline}
                    />
                </Content>
                <Shadow />
            </Card>
            {showDecline && (
                <CancelationDeclinePopup
                    gig={gig}
                    hide={() => setShowDecline(false)}
                    onCancelled={() => setShowDecline(false)}
                />
            )}
        </Wrapper>
    );
};

const UndoPassCard = ({ undo, undoing }) => {
    return (
        <Wrapper>
            <Row between>
                <Body>You've passed on the opportunity.</Body>
                <SmartButton level="tertiary" onClick={undo} loading={undoing}>
                    Undo
                </SmartButton>
            </Row>
            <Hr style={{ marginTop: 15 }} />
        </Wrapper>
    );
};

const DeclinedActions = ({ undoDecline, undoingDecline }) => {
    return (
        <Buttons>
            <SmartButton loading={undoingDecline} level="tertiary" onClick={undoDecline}>
                Undo decline
            </SmartButton>
            <SecondaryButton>View details</SecondaryButton>
        </Buttons>
    );
};

const DefaultActions = ({ id }) => {
    return (
        <Buttons>
            <SecondaryButton>View details</SecondaryButton>
        </Buttons>
    );
};

const RequestedActions = ({ id, showDecline }) => {
    return (
        <Buttons>
            <TeritaryButton onClick={showDecline}>Decline</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const OppertunityActions = ({ passing, passOpportunity }) => {
    return (
        <Buttons>
            <SmartButton loading={passing} level="tertiary" onClick={passOpportunity}>
                Pass
            </SmartButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};
const AcceptedActions = ({ id, showDecline }) => {
    return (
        <Buttons>
            <TeritaryButton onClick={showDecline}>Decline</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const ConfirmedActions = ({ id, showDecline }) => {
    return (
        <Buttons>
            <TeritaryButton onClick={showDecline}>Cancel gig</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const actions = {
    [gigStates.DECLINED]: DeclinedActions,
    [gigStates.EVENT_CANCELLED]: DefaultActions,
    [gigStates.ACCEPTED]: AcceptedActions,
    [gigStates.CANCELLED]: DefaultActions,
    [gigStates.CONFIRMED]: ConfirmedActions,
    [gigStates.FINISHED]: DefaultActions,
    [gigStates.LOST]: DefaultActions,
    [gigStates.ORGANIZER_DECLINED]: DefaultActions,
    [gigStates.REQUESTED]: RequestedActions,
};

const Offer = ({
    offer,
    gig,
    hasMessage,
    loading,
    opportunity,
    showDecline,
    passOpportunity,
    passing,
    undoDecline,
    undoingDecline,
}) => {
    const { statusHumanized, status, id } = gig || {};

    let Actions = actions[status] || DefaultActions;
    if (opportunity) {
        Actions = OppertunityActions;
    }

    return (
        <OfferRow middle>
            <OfferTextWrapper>
                {offer && <OfferText muted={false}>{offer.formatted}</OfferText>}

                <OfferText muted={true}>
                    {statusHumanized || (loading ? <Skeleton /> : null)}
                </OfferText>
            </OfferTextWrapper>
            <Filler />

            <Row style={{ position: 'relative' }}>
                {loading ? (
                    <Buttons>
                        <Skeleton height={40} width={200} />
                    </Buttons>
                ) : (
                    <Actions
                        id={id}
                        opportunity={opportunity}
                        showDecline={showDecline}
                        passOpportunity={passOpportunity}
                        passing={passing}
                        undoDecline={undoDecline}
                        undoingDecline={undoingDecline}
                    />
                )}
                {hasMessage && (
                    <NotificationBubble
                        style={{
                            position: 'absolute',
                            right: -10,
                            top: 10,
                            lineHeight: '1.2em',
                            border: '2px solid white',
                        }}
                    >
                        <span>!</span>
                    </NotificationBubble>
                )}
            </Row>
        </OfferRow>
    );
};

const OfferTextWrapper = styled(Col)`
    margin-top: 18px;
`;

const Filler = styled.div`
    flex: 1;
    width: 100%;
    @media only screen and (max-width: 710px) {
        display: none;
    }
`;

const Buttons = styled(Row)`
    margin-top: 18px;
    justify-content: center;
    align-items: center;
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

const Content = styled(Col)`
    padding: 24px;
    flex: 2;
`;

const Wrapper = styled(Col)`
    position: relative;
    margin-bottom: 30px;
    width: 100%;
    opacity: 0;
    animation: ${keyframeFadeIn} 400ms ease forwards;
    animation-delay: ${({ idx }) => idx * 150}ms;
    ${({ disabled }) =>
        disabled &&
        css`
            pointer-events: none;
            animation: none;
            opacity: 1;
            button {
                pointer-events: none;
            }
        `}
`;

const Card = styled(NavLink)`
    display: flex;
    overflow: hidden;
    flex-direction: row;
    border-radius: 4px;
    flex-wrap: wrap;
    background: #fff;
    z-index: 1;
    flex: 1;
    > a {
        width: 100%;
    }
`;

const Shadow = styled.div`
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.1);
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    border-radius: 4px;
    pointer-events: none;
`;

export default GigCard;
