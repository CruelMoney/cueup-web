import React, { useState } from 'react';
import { useHistory } from 'react-router';
import styled, { css } from 'styled-components';
import { useQuery } from 'react-apollo';
import { formatDistance } from 'date-fns';
import Popup from 'components/common/Popup';
import { RowWrap, Row, Col, PrimaryButton } from 'components/Blocks';
import { BodySmall, Body } from 'components/Text';
import { SUBSCRIPTION_TIERS } from './gql';

export const PlanChooser = () => {
    const history = useHistory();

    return (
        <Popup
            lazy={false}
            noPadding
            width={1000}
            showing
            onClose={() => {
                history.goBack();
            }}
        >
            <RowWrap>
                <LeftSection>
                    <h1>
                        Get more gigs
                        <br />
                        with Cueup Pro
                    </h1>
                </LeftSection>
                <RightSection>
                    <Plans />
                </RightSection>
            </RowWrap>
        </Popup>
    );
};

const Plans = () => {
    const [selectedTier, setTier] = useState();

    const { loading, data } = useQuery(SUBSCRIPTION_TIERS);

    const tiers = data?.subscriptionTiers || [];

    const offerEndDate = new Date(2020, 10, 1);
    const endingFormatted = formatDistance(offerEndDate, new Date(), { addSuffix: true });

    return (
        <PlanWrapper>
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <Body>Launch Offer ending {endingFormatted}.</Body>
            </div>
            {tiers
                .sort((t1, t2) => t1.price.amount - t2.price.amount) // cheapest first
                .map((t) => (
                    <Tier
                        key={t.id}
                        active={selectedTier === t}
                        onClick={() => setTier(t)}
                        {...t}
                    />
                ))}

            <div style={{ flex: 1 }} />
            <PrimaryButton disabled={!selectedTier}>
                {selectedTier ? `Buy now - ${selectedTier.price.formatted}` : 'Buy now'}
            </PrimaryButton>
        </PlanWrapper>
    );
};

const intervalNames = Object.freeze({
    YEARLY: 'Annual',
    MONTHLY: 'Monthly',
});

const Tier = ({ beforePriceMonthly, price, priceMonthly, interval, onClick, active }) => {
    return (
        <TierWrapper active={active} onClick={onClick}>
            <Row between middle>
                <Col>
                    <h3>{intervalNames[interval]}</h3>
                </Col>
                <Col>
                    <Price>
                        {beforePriceMonthly && (
                            <BeforePrice> {beforePriceMonthly.formatted}</BeforePrice>
                        )}
                        {priceMonthly.formatted}
                        <span> / month</span>
                    </Price>
                    {interval === 'YEARLY' && (
                        <BodySmall>Billed as one payment of {price.formatted}</BodySmall>
                    )}
                </Col>
            </Row>
        </TierWrapper>
    );
};

const BeforePrice = styled.span`
    margin-right: 5px;
    position: relative;
    :after {
        content: '';
        height: 1px;
        width: '100%';
        position: absolute;
        top: 50%;
        left: 0;
        right: 0;
        background-color: #98a4b3;
    }
`;

const Price = styled.p`
    > span {
        font-weight: 500;
        color: #98a4b3;
    }
`;

const TierWrapper = styled.button`
    background-color: #fff;
    padding: 0 2em;
    min-height: 6em;
    margin-bottom: 1em;
    border-radius: 6px;
    box-shadow: 4px 10px 20px rgba(0, 0, 0, 0.09);
    width: 100%;
    color: #32325d;
    border-width: 3px;
    border: 3px solid #fff !important;
    text-align: left;
    position: relative;
    h3,
    p {
        font-weight: 600;
        font-size: 1.2em;
        position: relative;
    }
    ${Price} {
        font-size: 1em;
    }
    ${Row} {
        position: relative;
    }
    ${BodySmall} {
        font-size: 0.8em;
        color: #98a4b3;
        line-height: 1.5em;
    }
    transition: all 250ms ease;
    &:hover {
        box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.09);
        transform: scale(0.99);
    }
    ${({ active }) =>
        active &&
        css`
            border-color: #50e3c2 !important;
            box-shadow: 2px 5px 10px rgba(0, 0, 0, 0.09);
            transform: scale(0.99);
        `}
`;

const PlanWrapper = styled(Col)`
    height: 100%;
    ${PrimaryButton} {
        max-width: 100%;
        width: 100%;
    }
`;

const LeftSection = styled.div`
    width: 50%;
    flex: 1;
    padding: 3em;

    h1 {
        font-size: 2.5em;
    }
`;

const RightSection = styled.div`
    width: 50%;
    flex: 1;
    background-color: #f6f8f9;
    padding: 3em;
    height: 500px;
`;

export default PlanChooser;
