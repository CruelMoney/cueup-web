import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router';
import styled, { css } from 'styled-components';
import { useQuery } from 'react-apollo';

import Skeleton from 'react-loading-skeleton';
import Popup from 'components/common/Popup';
import { Row, Col, PrimaryButton, TeritaryButton, SecondaryButton } from 'components/Blocks';
import { BodySmall, Body } from 'components/Text';
import { Label, ProFeature } from 'components/FormComponents';
import { ME, MY_GIGS } from 'components/gql';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { showOlark } from 'utils/olark';
import { SUBSCRIPTION_TIERS } from './gql';
import PaymentForm from './PaymentForm';

export const GenericPopup = ({ children, showPayment = true }) => {
    const history = useHistory();

    return (
        <Popup
            lazy={false}
            noPadding
            style={{ maxWidth: '100vw', width: '1000px' }}
            showing
            onClose={() => {
                history.goBack();
            }}
        >
            <Content showPayment={showPayment}>{children}</Content>
        </Popup>
    );
};

const Content = ({ children, showPayment }) => {
    const [selectedTier, setTier] = useState();

    const { data } = useQuery(ME);

    const isPro = data?.me?.appMetadata?.isPro;

    if (isPro) {
        return (
            <ContentContainer data-cy="subscription-popup">
                <Success user={data?.me} />
            </ContentContainer>
        );
    }

    return (
        <ContentContainer data-cy="subscription-popup">
            <LeftSection>{children}</LeftSection>
            {showPayment && (
                <RightSection>
                    <Col style={{ height: '100%' }}>
                        <Plans selectedTier={selectedTier} setTier={setTier} />
                        <div style={{ flex: 1 }} />
                        <PaymentForm selectedTier={selectedTier} />
                    </Col>
                </RightSection>
            )}
        </ContentContainer>
    );
};

const Success = ({ user }) => {
    const { data, loading } = useQuery(MY_GIGS, { variables: { limit: 1 } });

    const gig = data?.myGigs?.edges?.[0];

    const history = useHistory();
    const { translate } = useTranslate();

    const baseRoute = `${translate(appRoutes.user)}/${user.permalink}`;

    const navigate = (to, reload) => {
        const route = `${baseRoute}/${to}`;
        if (reload) {
            window.location.href = route;
        } else {
            history.push(route);
        }
    };

    const navigateToLatestGig = () => {
        if (gig) {
            history.push(`${translate(appRoutes.gig)}/${gig.id}`);
        }
    };

    return (
        <div style={{ padding: '2em', alignSelf: 'center' }} data-cy="subscription-welcome">
            <div style={{ textAlign: 'center' }}>
                <ProFeature disabled>Pro Member</ProFeature>
                <h2 style={{ maxWidth: 300, margin: 'auto' }}>
                    Welcome to your Cueup Pro Membership
                </h2>
                <Body style={{ marginBottom: 24, marginTop: 24, maxWidth: 500 }}>
                    We're excited to have you on the <b>Pro Team</b>.
                </Body>
            </div>

            <Col>
                <RowCustom between middle>
                    <Label>Add your website</Label>
                    <SecondaryButton onClick={() => navigate(userRoutes.settings + '#website')}>
                        Go
                    </SecondaryButton>
                </RowCustom>
                <RowCustom between middle>
                    <Label>Add more playing locations</Label>
                    <SecondaryButton
                        onClick={() => navigate(userRoutes.settings + '?modal=location', true)}
                    >
                        Go
                    </SecondaryButton>
                </RowCustom>
                {loading || gig ? (
                    <RowCustom between middle>
                        <Label>Contact the organizer from your latest gig</Label>
                        <SecondaryButton onClick={navigateToLatestGig}>Go</SecondaryButton>
                    </RowCustom>
                ) : null}
                <RowCustom between middle>
                    <Label>Upload mixtapes</Label>
                    <SecondaryButton
                        onClick={() => navigate(userRoutes.sounds + '?modal=addSound')}
                    >
                        Go
                    </SecondaryButton>
                </RowCustom>
                <RowCustom between middle>
                    <Label>Contact the Cueup team</Label>
                    <SecondaryButton onClick={showOlark}>Go</SecondaryButton>
                </RowCustom>
            </Col>
        </div>
    );
};

const RowCustom = styled(Row)`
    margin-bottom: 12px;
    ${SecondaryButton} {
        margin-left: 30px;
    }
`;

function CountdownTimer() {
    const calculateTimeLeft = () => {
        const difference = Number(Date.UTC(2020, 7, 17, 0, 0, 0)) - Number(new Date().valueOf());
        let timeLeft = {};

        if (difference > 0) {
            timeLeft = {
                days: Math.floor(difference / (1000 * 60 * 60 * 24)),
                hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
                minutes: Math.floor((difference / 1000 / 60) % 60),
                seconds: Math.floor((difference / 1000) % 60),
            };
        }

        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    useEffect(() => {
        setTimeout(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);
    });

    const timerComponents = [];

    Object.keys(timeLeft).forEach((interval) => {
        if (!timeLeft[interval] && interval !== 'seconds') {
            return;
        }

        timerComponents.push(
            <span key={interval}>
                {timeLeft[interval]} {interval}{' '}
            </span>
        );
    });

    return <strong>{timerComponents.length ? timerComponents : <span>Time's up!</span>}</strong>;
}

const Plans = ({ setTier, selectedTier }) => {
    const { loading, data } = useQuery(SUBSCRIPTION_TIERS);

    const tiers = data?.subscriptionTiers || [];

    return (
        <>
            <TopText style={{ marginBottom: 24, textAlign: 'center' }}>
                {/* <Body style={{ fontSize: '1em' }}>Launch offer ends in</Body> */}
                {/* <CountdownTimer /> */}
                <Body style={{ fontSize: '1em' }}>Subscribe now and get this price forever.</Body>
            </TopText>

            {loading && (
                <>
                    <Tier loading />
                    <Tier loading />
                </>
            )}

            {tiers
                .sort((t1, t2) => t1.price.amount - t2.price.amount) // cheapest first
                .map((t, idx) => (
                    <Tier
                        key={t.id}
                        testId={`plan-${idx + 1}-button`}
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

const Tier = ({
    beforePriceMonthly,
    price,
    priceMonthly,
    interval,
    onClick,
    active,
    loading,
    testId,
}) => {
    return (
        <TierWrapper active={active} onClick={onClick} data-cy={testId}>
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

const ContentContainer = styled.div`
    display: flex;
    justify-content: center;
    flex-direction: row;
    @media screen and (max-width: 1000px) {
        flex-direction: column-reverse;
        align-items: center;
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
    text-align: right;
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
    font-size: 1em;

    @media screen and (max-width: 1000px) {
        font-size: 0.8em;
        padding: 0 1em;
    }

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

const LeftSection = styled.div`
    max-width: 500px;
    padding: 3em;
    h1 {
        font-size: 2.5em;
    }
    @media screen and (max-width: 1000px) {
        max-width: 100%;
        padding: 2em;
    }
`;

const RightSection = styled.div`
    max-width: 500px;
    background-color: #f6f8f9;
    padding: 2em;
    ${PrimaryButton} {
        max-width: 100%;
        width: 100%;
    }

    @media screen and (max-width: 1000px) {
        max-width: 100%;
        width: 100%;
    }
`;

const TopText = styled.div`
    margin-bottom: 24;
    text-align: center;
    font-size: 1.2em;
    @media screen and (max-width: 1000px) {
        font-size: 1em;
    }
`;

export default GenericPopup;
