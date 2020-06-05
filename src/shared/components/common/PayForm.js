import React, { useRef, useState, useEffect, useCallback } from 'react';
import useComponentSize from '@rehooks/component-size';
import { useMutation, useLazyQuery, useQuery } from 'react-apollo';
import { Icon } from '@iconify/react';
import checkmarkCircle from '@iconify/icons-ion/checkmark-circle';

import styled from 'styled-components';
import { captureException } from '@sentry/core';
import { useParams, Route, useHistory, Switch } from 'react-router';
import {
    LoadingIndicator,
    Col,
    RowMobileCol,
    SmartButton,
    TeritaryButton,
} from 'components/Blocks';
import RadioSelect from 'components/RadioSelect';
import { PAYOUT_TYPES, PAYMENT_PROVIDERS } from 'constants/constants';
import { Body, SmallHeader } from 'components/Text';
import useTranslate from 'components/hooks/useTranslate';
import { trackPageView, trackEventPaid } from 'utils/analytics';
import { REQUEST_PAYMENT_INTENT, PAYMENT_CONFIRMED, EVENT_GIGS } from '../../routes/Event/gql';
import TextWrapper from './TextElement';
import MoneyTable, { TableItem } from './MoneyTable';
import StripeFormWrapper from './StripePayForm';
import XenditPayForm from './XenditPayForm';
import NotifyPayment from './NotifyPayment';

const BankPayForm = ({
    translate,
    event,
    currency,
    offer,
    id,
    currentLanguage,
    paymentConfirmed,
    paymentIntent,
    canBePaid,
    chosenMethod,
}) => {
    const history = useHistory();

    if (!canBePaid && paymentIntent.paymentProvider === 'STRIPE') {
        return (
            <div style={{ padding: '2em' }}>
                <NotifyPayment
                    hashKey={event.hash}
                    eventId={event.id}
                    daysUntilPaymentPossible={offer.daysUntilPaymentPossible}
                    translate={translate}
                />
            </div>
        );
    }

    const variables = {
        id,
        locale: currentLanguage,
    };

    if (currency) {
        variables.currency = currency;
    }

    const PayForms = {
        STRIPE: (
            <StripeFormWrapper
                onPaymentConfirmed={paymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={history.goBack}
            />
        ),
        XENDIT: (
            <XenditPayForm
                onPaymentConfirmed={paymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={history.goBack}
            />
        ),
        DIRECT: (
            <StripeFormWrapper
                onPaymentConfirmed={paymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={history.goBack}
            />
        ),
    };

    return (
        <div>
            <TextWrapper
                label={
                    paymentIntent.paymentProvider === PAYMENT_PROVIDERS.DIRECT
                        ? translate('Confirm Booking')
                        : translate('Pay')
                }
                showLock={true}
                text={chosenMethod?.description ? null : translate('event:offer.payment-info')}
            />
            {chosenMethod?.description && (
                <>
                    <Body style={{ marginBottom: '12px' }}>
                        You'll only pay a small amount of the offer, and the DJ will handle the rest
                        of the payment. After this payment, the booking is confirmed and you'll
                        receive each others contact information.
                    </Body>
                    <SmallHeader>Directions by the DJ:</SmallHeader>
                    <Body
                        style={{ fontStyle: 'italic', marginBottom: '30px' }}
                    >{`"${chosenMethod?.description}"`}</Body>
                </>
            )}
            {PayForms[paymentIntent.paymentProvider]}
        </div>
    );
};

const PaymentWrapper = (props) => {
    const {
        onPaymentConfirmed,
        currency,
        id,
        event,
        gig,
        currentLanguage,
        translate,
        match,
        method,
    } = props;

    let { availablePayoutMethods = [] } = gig ?? {};
    const { offer: gigOffer } = gig ?? {};

    const div = useRef();
    const history = useHistory();
    const size = useComponentSize(div);
    const [isPaid, setIsPaid] = useState(false);

    let initialPaymentType = method;
    if (availablePayoutMethods.length === 1) {
        initialPaymentType = availablePayoutMethods[0].payoutType;
    }
    const canSelectPayment = availablePayoutMethods.length > 1;

    const [paymentType, setPaymentType] = useState(initialPaymentType);

    const [requestPaymentIntent, { loading, data }] = useLazyQuery(REQUEST_PAYMENT_INTENT, {
        onCompleted: () => history.push(match.url + '/payment/' + paymentType),
        onError: captureException,
    });

    const { requestPaymentIntent: paymentIntent } = data ?? {};

    const { amount, offer: paymentOffer } = paymentIntent ?? {};

    const offer = {
        ...gigOffer,
        ...paymentOffer,
    };

    const canBePaid = offer.daysUntilPaymentPossible < 1;
    // can be paid direct
    if (availablePayoutMethods.some((pm) => pm.payoutType === PAYOUT_TYPES.DIRECT) && !canBePaid) {
        availablePayoutMethods = availablePayoutMethods.filter(
            (pm) => pm.payoutType === PAYOUT_TYPES.DIRECT
        );
    }

    const payLater = paymentType === PAYOUT_TYPES.DIRECT;

    const chosenMethod = availablePayoutMethods.find((v) => v.payoutType === paymentType);

    const [setPaymentConfirmed] = useMutation(PAYMENT_CONFIRMED, {
        variables: {
            gigId: id,
            eventId: event.id,
            amountPaid: offer.totalPayment,
            amountLeft: null,
        },
        onError: captureException,
    });

    useEffect(() => {
        if (paymentType) {
            requestPaymentIntent({
                variables: {
                    id,
                    currency,
                    locale: currentLanguage,
                    paymentType,
                },
            });
        }
    }, [currency, currentLanguage, id, paymentType, requestPaymentIntent]);

    const paymentConfirmed = useCallback(() => {
        setPaymentConfirmed();
        onPaymentConfirmed && onPaymentConfirmed();
        setIsPaid(true);
        try {
            trackEventPaid({
                currency: currency,
                value: amount.amount / 100,
            });
        } catch (error) {
            captureException(error);
        }
    }, [amount, onPaymentConfirmed, setPaymentConfirmed, currency]);

    if (isPaid) {
        return <ThankYouContent style={size} translate={translate} />;
    }

    return (
        <PayFormContainer className="pay-form" ref={div}>
            <div className="left">
                <Switch>
                    {canSelectPayment && (
                        <Route
                            path={match.path}
                            exact
                            render={() => (
                                <PaymentMethodSelect
                                    {...props}
                                    setPaymentType={setPaymentType}
                                    paymentType={paymentType}
                                    loading={loading}
                                />
                            )}
                        />
                    )}
                    {paymentIntent && (
                        <Route
                            path={match.path + '/payment/:method'}
                            render={() => (
                                <BankPayForm
                                    {...props}
                                    chosenMethod={chosenMethod}
                                    paymentIntent={paymentIntent}
                                    paymentConfirmed={paymentConfirmed}
                                    canBePaid={canBePaid}
                                />
                            )}
                        />
                    )}
                    <LoadingPaymentInitial translate={translate} />
                </Switch>
            </div>

            <div className="right">
                <MoneyTable>
                    <TableItem label={translate('DJ price')}>{offer.offer?.formatted}</TableItem>
                    {!!payLater && (
                        <TableItem payLater label={<span>{translate('Pay directly to DJ')}</span>}>
                            {offer.totalPayout?.formatted}
                        </TableItem>
                    )}
                    <TableItem
                        data-cy="payment-amount"
                        label={payLater ? 'Payment now' : 'Total'}
                        bold
                    >
                        {amount ? amount.formatted : offer.totalPayment.formatted}
                    </TableItem>
                </MoneyTable>

                <p
                    className="terms_link"
                    dangerouslySetInnerHTML={{ __html: translate('event:offer.terms') }}
                />
            </div>
        </PayFormContainer>
    );
};

const LoadingPaymentInitial = ({ translate }) => {
    return (
        <>
            <TextWrapper
                label={translate('Pay')}
                showLock={true}
                text={translate('event:offer.payment-info')}
            />
            <Col center>
                <LoadingIndicator label={translate('gettingPayment')} />
            </Col>
        </>
    );
};

const PaymentMethodSelect = (props) => {
    const history = useHistory();
    const { translate, loading, setPaymentType, paymentType } = props;
    const [chosen, setChosen] = useState(paymentType ?? PAYOUT_TYPES.BANK);

    return (
        <div>
            <TextWrapper label={translate('Pay-method')} showLock={true} />
            <RadioSelect
                containerStyle={{ marginBottom: '30px' }}
                setChosen={setChosen}
                chosen={chosen}
                options={[
                    {
                        title: 'Pay now',
                        description:
                            "Cueup will facilitate your payment. You'll pay today after completing the booking.",
                        value: PAYOUT_TYPES.BANK,
                    },
                    {
                        title: 'Pay later',
                        description:
                            "The DJ will handle the payment, and you'll only pay a small amount now.",
                        value: PAYOUT_TYPES.DIRECT,
                    },
                ]}
            />
            <RowMobileCol right>
                <TeritaryButton onClick={() => history.goBack()}>Go back</TeritaryButton>
                <SmartButton
                    level="primary"
                    data-cy="continue-button"
                    loading={loading}
                    onClick={() => setPaymentType(chosen)}
                >
                    Continue
                </SmartButton>
            </RowMobileCol>
        </div>
    );
};

const PayFormContainer = styled.div`
    display: flex;
    flex-wrap: wrap-reverse;
`;

const ThankYouContent = ({ translate, style }) => {
    useEffect(() => {
        try {
            trackPageView('confirm-booking/success');
        } catch (error) {
            captureException(error);
        }
    }, []);

    return (
        <div className="payment-confirmation" style={style}>
            <Icon icon={checkmarkCircle} style={{ fontSize: '42px' }} />
            <h3>{translate('payment-succes-message')}</h3>
        </div>
    );
};

const WithProps = ({ currency, ...props }) => {
    const { translate, currentLanguage } = useTranslate();
    const { gigId, id, hash, method } = useParams();

    const { data } = useQuery(EVENT_GIGS, { variables: { id, hash, currency } });

    const gigs = data?.event?.gigs || [];
    const gig = gigs.find((g) => g.id === gigId);

    return (
        <PaymentWrapper
            {...props}
            id={gigId}
            gig={gig}
            method={method}
            currency={currency}
            translate={translate}
            currentLanguage={currentLanguage}
        />
    );
};

export default WithProps;
