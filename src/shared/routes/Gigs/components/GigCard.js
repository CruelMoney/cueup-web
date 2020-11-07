import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import calendarIcon from '@iconify/icons-ion/ios-calendar';
import locationIcon from '@iconify/icons-ion/ios-location';
import { InlineIcon } from '@iconify/react';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';

import {
    Col,
    keyframeFadeIn,
    Row,
    TeritaryButton,
    Hr,
    RowWrap,
    PillLarge,
    PrimaryButton,
} from '../../../components/Blocks';
import { SmallHeader, BodySmall, BodyBold, SmallBold } from '../../../components/Text';

const GigCard = ({ style, idx, gig, hasMessage, ...props }) => {
    const { translate } = useTranslate();

    const { event, offer } = gig;
    const { start, name, location, description } = event;

    return (
        <Wrapper idx={idx} {...props}>
            <Card style={style}>
                <NavLink
                    to={{
                        pathname: `${translate(appRoutes.gig)}/${gig.id}`,
                    }}
                >
                    <Content>
                        <RowWrap style={{ marginBottom: '24px', width: '100%' }}>
                            <SmallHeader>{name}</SmallHeader>
                            <Filler />

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
                                {start.formattedDate}
                            </PillLarge>
                        </RowWrap>
                        <RowWrap>
                            <BodySmall
                                numberOfLines={3}
                                style={{ wordBreak: 'break-word', marginBottom: '24px' }}
                            >
                                {description}
                            </BodySmall>
                        </RowWrap>
                        <Hr />

                        <Offer {...offer} hasMessage={hasMessage} gig={gig} name={name} />
                    </Content>
                </NavLink>
            </Card>

            <Shadow />
        </Wrapper>
    );
};

const Offer = ({ offer, gig, hasMessage }) => {
    const { translate } = useTranslate();
    const { statusHumanized, id } = gig;

    return (
        <OfferRow middle>
            <OfferTextWrapper>
                {offer && <OfferText muted={false}>{offer.formatted}</OfferText>}

                <OfferText muted={true}>{statusHumanized}</OfferText>
            </OfferTextWrapper>
            <Filler />

            <Buttons>
                <NavLink
                    to={{
                        pathname: `${translate(appRoutes.gig)}/${id}`,
                    }}
                >
                    <TeritaryButton data-cy="gig-read-more">Decline</TeritaryButton>
                </NavLink>

                <PrimaryButton data-cy="gig-read-more">View details</PrimaryButton>
                {hasMessage && (
                    <span>
                        <div className="notification-bubble relative">!</div>
                        <SmallBold demi muted style={{ display: 'inline-block' }}>
                            New message
                        </SmallBold>
                    </span>
                )}
            </Buttons>
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
`;

export default GigCard;
