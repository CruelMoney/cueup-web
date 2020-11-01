import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { appRoutes } from 'constants/locales/appRoutes';
import {
    Col,
    keyframeFadeIn,
    Row,
    TeritaryButton,
    Hr,
    RowWrap,
    PillLarge,
} from '../../../components/Blocks';
import { SmallHeader, BodySmall, BodyBold, SmallBold } from '../../../components/Text';

const GigCard = ({ style, idx, gig, hasMessage, translate, ...props }) => {
    const { event, offer } = gig;
    let { start, name, description } = event;

    const shouldTruncate = description.length > 100;
    description = shouldTruncate ? description.substring(0, 100) + '...' : description;

    return (
        <Wrapper idx={idx} {...props}>
            <Card style={style}>
                <Content>
                    <RowWrap style={{ marginBottom: '24px', width: '100%' }}>
                        <SmallHeader>{name}</SmallHeader>
                        <Filler />

                        <PillLarge>{start.formattedDate}</PillLarge>
                    </RowWrap>
                    <RowWrap>
                        <BodySmall style={{ wordBreak: 'break-word', marginBottom: '24px' }}>
                            {description}
                        </BodySmall>
                    </RowWrap>
                    <Hr />

                    <Offer
                        {...offer}
                        hasMessage={hasMessage}
                        gig={gig}
                        translate={translate}
                        name={name}
                    />
                </Content>
            </Card>

            <Shadow />
        </Wrapper>
    );
};

const Offer = ({ offer, gig, hasMessage, translate }) => {
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
                    <TeritaryButton data-cy="gig-read-more">Read more</TeritaryButton>
                </NavLink>
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

const Buttons = styled(Col)`
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
`;

const Shadow = styled.div`
    box-shadow: 0 2px 30px 0 rgba(0, 0, 0, 0.3);
    position: absolute;
    top: 15px;
    left: 10px;
    bottom: 10px;
    right: 10px;
`;

export default GigCard;
