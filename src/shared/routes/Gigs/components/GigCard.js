import React from 'react';
import styled, { css } from 'styled-components';
import { NavLink } from 'react-router-dom';
import calendarIcon from '@iconify/icons-ion/ios-calendar';
import locationIcon from '@iconify/icons-ion/ios-location';
import timeIcon from '@iconify/icons-ion/ios-time';
import { InlineIcon } from '@iconify/react';
import moment from 'moment-timezone';
import Skeleton from 'react-loading-skeleton';
import { useMutation } from '@apollo/client';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { gigStates } from 'constants/constants';
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
} from '../../../components/Blocks';
import { SmallHeader, BodySmall, BodyBold, SmallBold } from '../../../components/Text';
import { UNDO_DECLINE } from '../gql';

const GigCard = ({ loading, style, idx, gig, hasMessage, opportunity, ...props }) => {
    const { translate } = useTranslate();

    const { event, offer } = gig || {};
    const { id, start, name, location, description, duration, createdAt, organizer } = event || {};

    const createdTimeAgo = loading ? null : moment(createdAt?.UTC).fromNow();

    return (
        <Wrapper idx={idx} disabled={loading} {...props}>
            <Card
                style={style}
                to={{
                    pathname: `${translate(appRoutes.gig)}/${gig?.id}`,
                }}
            >
                <Content>
                    <RowWrap style={{ marginBottom: '24px', width: '100%' }}>
                        <Col>
                            <SmallHeader>{name || <Skeleton width={200} />}</SmallHeader>

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
                    />
                </Content>
                <Shadow />
            </Card>
        </Wrapper>
    );
};

const DeclinedActions = ({ id }) => {
    const [mutate, { loading }] = useMutation(UNDO_DECLINE, {
        variables: {
            id,
        },
    });

    return (
        <Buttons>
            <SmartButton loading={loading} level="tertiary" onClick={mutate}>
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

const RequestedActions = ({ id }) => {
    return (
        <Buttons>
            <TeritaryButton>Decline</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const OppertunityActions = ({ id }) => {
    return (
        <Buttons>
            <TeritaryButton>Pass</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};
const AcceptedActions = ({ id }) => {
    return (
        <Buttons>
            <TeritaryButton>Decline</TeritaryButton>
            <PrimaryButton>View details</PrimaryButton>
        </Buttons>
    );
};

const ConfirmedActions = ({ id }) => {
    return (
        <Buttons>
            <TeritaryButton>Cancel gig</TeritaryButton>
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

const Offer = ({ offer, gig, hasMessage, loading, opportunity }) => {
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

            {loading ? (
                <Buttons>
                    <Skeleton height={40} width={200} />
                </Buttons>
            ) : (
                <Actions id={id} opportunity={opportunity} />
            )}
            {hasMessage && (
                <span>
                    <div className="notification-bubble relative">!</div>
                    <SmallBold demi muted style={{ display: 'inline-block' }}>
                        New message
                    </SmallBold>
                </span>
            )}
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
