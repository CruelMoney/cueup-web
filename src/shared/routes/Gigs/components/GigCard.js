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
    RowMobileCol,
} from '../../../components/Blocks';
import { SmallHeader, BodySmall, BodyBold, Body } from '../../../components/Text';
import { UNDO_PASS, UNDO_DECLINE, PASS_OPPORTUNITY } from '../gql';
import { UsingBookingLinkPill } from './Shared';

const GigCard = ({ loading, style, idx, gig, opportunity, ...props }) => {
    const { event, offer, referred, status } = gig || {};
    const { id, start, name, location, description, duration, createdAt, organizer } = event || {};
    const { pathname } = useLocation();
    const { translate } = useTranslate();
    const [showDecline, setShowDecline] = useState(false);
    const [hasPassed, setHasPassed] = useState(false);

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

    if (hasPassed || status === gigStates.PASS) {
        return <UndoPassCard undo={undoPassOpportunity} undoing={undoing} />;
    }

    const createdTimeAgo = loading ? null : moment(createdAt?.UTC).fromNow();

    const linkTo = gig?.id
        ? `${translate(appRoutes.gig)}/${gig?.id}`
        : `${translate(appRoutes.opportunity)}/${id}`;

    return (
        <Wrapper idx={idx} disabled={loading} {...props}>
            <Card
                style={style}
                data-cy="gig-link"
                to={{
                    pathname: linkTo,
                    state: {
                        comingFrom: pathname,
                    },
                }}
            >
                <Content>
                    <Col>
                        <RowWrap middle between>
                            <SmallHeader style={{ marginRight: 4, marginBottom: 6 }}>
                                {name || <Skeleton width={200} />}
                            </SmallHeader>
                            {referred && <UsingBookingLinkPill />}
                        </RowWrap>
                        <BodySmall>
                            <span>
                                {organizer?.userMetadata?.firstName ||
                                    (loading ? <Skeleton width={50} /> : null)}
                            </span>
                            <span style={{ top: '2px', opacity: '0.5' }}>{'  •  '}</span>
                            {!loading ? (
                                <span>Added {createdTimeAgo}</span>
                            ) : (
                                <Skeleton width={50} />
                            )}
                        </BodySmall>
                        <PillRow>
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
                        </PillRow>
                    </Col>

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
        <Buttons reverse>
            <SmartButton loading={undoingDecline} level="tertiary" onClick={undoDecline}>
                Undo decline
            </SmartButton>
            <SecondaryButton>View details</SecondaryButton>
        </Buttons>
    );
};

const DefaultActions = ({ id }) => {
    return (
        <Buttons reverse>
            <SecondaryButton>View details</SecondaryButton>
        </Buttons>
    );
};

const RequestedActions = ({ id, showDecline }) => {
    return (
        <Buttons reverse>
            <TeritaryButton onClick={showDecline}>Decline</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const OppertunityActions = ({ passing, passOpportunity }) => {
    return (
        <Buttons reverse>
            <SmartButton loading={passing} level="tertiary" onClick={passOpportunity}>
                Pass
            </SmartButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};
const AcceptedActions = ({ id, showDecline }) => {
    return (
        <Buttons reverse>
            <TeritaryButton onClick={showDecline}>Decline</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const ConfirmedActions = ({ id, showDecline }) => {
    return (
        <Buttons reverse>
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
        <RowMobileCol middle>
            <OfferTextWrapper>
                {offer && <OfferText greyed={false}>{offer.formatted}</OfferText>}

                <OfferText greyed={true}>
                    {statusHumanized || (loading ? <Skeleton /> : null)}
                </OfferText>
            </OfferTextWrapper>

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
        </RowMobileCol>
    );
};

const OfferTextWrapper = styled(Col)`
    margin-top: 18px;
`;

const Buttons = styled(RowMobileCol)`
    margin-top: 18px;
    flex-grow: 1;
    justify-content: flex-end;
    align-items: center;
    @media only screen and (max-width: 425px) {
        width: 100%;
    }
`;

const OfferText = styled(BodyBold)`
    font-size: 18px;
    margin: 0;
    color: ${({ greyed }) => (greyed ? '#98A4B3' : '#122b48')};
`;

const Content = styled(Col)`
    padding: 24px;
    flex: 2;
`;

const PillRow = styled(RowWrap)`
    margin-bottom: 24px;
    width: 100%;
    margin-left: -6px;
    margin-top: 12px;
    > span {
        margin-bottom: 3px;
    }
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
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.1);
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

export default GigCard;
