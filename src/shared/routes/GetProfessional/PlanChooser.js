import React, { useState } from 'react';
import { useHistory } from 'react-router';
import styled, { css } from 'styled-components';
import { useQuery } from 'react-apollo';
import { formatDistance } from 'date-fns';
import { Icon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';

import Skeleton from 'react-loading-skeleton';
import Popup from 'components/common/Popup';
import { Row, Col, PrimaryButton, Avatar } from 'components/Blocks';
import { BodySmall, Body } from 'components/Text';
import { DumbCheckbox } from 'components/Checkbox';
import { SUBSCRIPTION_TIERS } from './gql';
import PaymentForm from './PaymentForm';

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
            <Content />
        </Popup>
    );
};

const Content = () => {
    const [selectedTier, setTier] = useState();
    const [success, setSuccess] = useState(false);

    if (success) {
        return <Success />;
    }

    return (
        <ContentContainer>
            <LeftSection>
                <h1>
                    Get more gigs
                    <br />
                    with Cueup Pro
                </h1>

                <Col>
                    <CustomCheckBox checked label="No service fee on gigs." />
                    <CustomCheckBox checked label="Direct contact to organizers." />
                    <CustomCheckBox checked label="Priority on new events." />
                    <CustomCheckBox checked label="Unlimited playing locations & travel." />
                    <CustomCheckBox checked label="Add website & social media links to profile." />
                    <CustomCheckBox
                        checked
                        label="Automatic refund each month if you don't receive any gig requests."
                    />
                    <CustomCheckBox checked label="Unlimited mixtape uploads in 320kbps." />
                    <CustomCheckBox checked label="Attach documents to offers." />
                    <CustomCheckBox checked label="...and so much more. Read more here." />
                    <Testimonial />
                </Col>
            </LeftSection>
            <RightSection>
                <Col style={{ height: '100%' }}>
                    <Plans selectedTier={selectedTier} setTier={setTier} />
                    <div style={{ flex: 1 }} />
                    <PaymentForm selectedTier={selectedTier} setSuccess={setSuccess} />
                </Col>
            </RightSection>
        </ContentContainer>
    );
};

const Success = () => {
    return (
        <div className="payment-confirmation">
            <Icon icon={checkmarkCircle} style={{ fontSize: '42px' }} />
            <Body>You are now a Cueup Pro Member.</Body>
        </div>
    );
};

const Plans = ({ setTier, selectedTier }) => {
    const { loading, data } = useQuery(SUBSCRIPTION_TIERS);

    const tiers = data?.subscriptionTiers || [];

    const offerEndDate = new Date(2020, 10, 1);
    const endingFormatted = formatDistance(offerEndDate, new Date(), { addSuffix: true });

    return (
        <>
            <div style={{ marginBottom: 24, textAlign: 'center' }}>
                <Body>
                    Launch Offer valid for 20 days 2 hours 1 minute. Subscribe now and get this
                    price forever.
                </Body>
            </div>

            {loading && (
                <>
                    <Tier loading />
                    <Tier loading />
                </>
            )}

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
        </>
    );
};

const intervalNames = Object.freeze({
    YEARLY: 'Annual',
    MONTHLY: 'Monthly',
});

const Tier = ({ beforePriceMonthly, price, priceMonthly, interval, onClick, active, loading }) => {
    return (
        <TierWrapper active={active} onClick={onClick}>
            {loading ? (
                <Skeleton />
            ) : (
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
            )}
        </TierWrapper>
    );
};

const Testimonial = () => {
    return (
        <TestimonialWrapper>
            <Avatar size="large" src={'https://i.vimeocdn.com/portrait/13325432_640x640'} />
            <BodySmall style={{ marginLeft: 12 }}>
                "I like to travel and thanks to Cueup I’ve had a steady stream of gigs while
                traveling. Best investment I’ve made was becoming Pro."
                <Quotee>- Oscar Bandersen, DJ & Producer</Quotee>
            </BodySmall>
        </TestimonialWrapper>
    );
};

const TestimonialWrapper = styled(Row)`
    margin-top: 1em;
    img {
        transform: scale(1.8);
    }
`;

const Quotee = styled.span`
    display: block;
    font-weight: 500;
    color: #98a4b3;
`;

const ContentContainer = styled.div`
    display: flex;
`;

const CustomCheckBox = styled(DumbCheckbox)`
    margin-bottom: 1em;
    div {
        cursor: default !important;
    }
`;

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

const TierLoading = styled(TierWrapper)``;

const LeftSection = styled.div`
    width: 50%;

    padding: 3em;

    h1 {
        font-size: 2.5em;
    }
`;

const RightSection = styled.div`
    width: 50%;
    background-color: #f6f8f9;
    padding: 3em;
    ${PrimaryButton} {
        max-width: 100%;
        width: 100%;
    }
`;

export default PlanChooser;
