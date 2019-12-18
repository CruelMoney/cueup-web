import React, { useRef, useState, useEffect } from 'react';
import useComponentSize from '@rehooks/component-size';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { useMutation, useLazyQuery } from 'react-apollo';
import ReactPixel from 'react-facebook-pixel';
import Checkmark from 'react-ionicons/lib/IosCheckmarkCircle';
import styled from 'styled-components';
import { LoadingIndicator, Col, RowMobileCol, SmartButton } from 'components/Blocks';
import RadioSelect from 'components/RadioSelect';
import { PAYOUT_TYPES, PAYMENT_PROVIDERS } from 'constants/constants';
import { Body, SmallHeader } from 'components/Text';
import { REQUEST_PAYMENT_INTENT, PAYMENT_CONFIRMED } from '../../routes/Event/gql';
import * as tracker from '../../utils/analytics/autotrack';
import * as actions from '../../actions/SessionActions';
import addTranslate from '../higher-order/addTranslate';
import content from '../../routes/Event/content.json';
import TextWrapper from './TextElement';
import MoneyTable, { TableItem } from './MoneyTable';
import StripeFormWrapper from './StripePayForm';
import XenditPayForm from './XenditPayForm';
import requestFormContent from './RequestForm/content.json';
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
    goBack,
    canBePaid,
    chosenMethod,
}) => {
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
                goBack={goBack}
            />
        ),
        XENDIT: (
            <XenditPayForm
                onPaymentConfirmed={paymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={goBack}
            />
        ),
        DIRECT: (
            <StripeFormWrapper
                onPaymentConfirmed={paymentConfirmed}
                paymentIntent={paymentIntent}
                goBack={goBack}
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
                text={chosenMethod?.description ? null : translate('event.offer.payment-info')}
            />
            {chosenMethod?.description && (
                <>
                    <SmallHeader>Description by the DJ:</SmallHeader>
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
        translate,
        onPaymentConfirmed,
        currency,
        id,
        event,
        gig,
        currentLanguage,
        changeCurrency,
    } = props;
    const div = useRef();
    const size = useComponentSize(div);
    const [isPaid, setIsPaid] = useState(false);
    const [requestPaymentIntent, { loading, data }] = useLazyQuery(REQUEST_PAYMENT_INTENT);

    let { availablePayoutMethods = [] } = gig ?? {};
    const { offer: gigOffer } = gig ?? {};
    const { requestPaymentIntent: paymentIntent, offer: paymentOffer } = data ?? {};

    const offer = {
        ...gigOffer,
        ...paymentOffer,
    };

    const canBePaid = offer.daysUntilPaymentPossible < 1;
    const { recommendedCurrency } = paymentIntent ?? {};
    const showCurrencyChange =
        recommendedCurrency && (currency && recommendedCurrency !== currency);
    // can be paid direct
    if (availablePayoutMethods.some((pm) => pm.payoutType === PAYOUT_TYPES.DIRECT) && !canBePaid) {
        availablePayoutMethods = availablePayoutMethods.filter(
            (pm) => pm.payoutType === PAYOUT_TYPES.DIRECT
        );
    }

    let initialPaymentType;
    if (availablePayoutMethods.length === 1) {
        initialPaymentType = availablePayoutMethods[0].payoutType;
    }
    const canSelectPayment = availablePayoutMethods.length > 1;

    const [paymentType, setPaymentType] = useState(initialPaymentType);

    const payLater = paymentType === PAYOUT_TYPES.DIRECT;

    const chosenMethod = availablePayoutMethods.find((v) => v.payoutType === paymentType);

    const [setPaymentConfirmed] = useMutation(PAYMENT_CONFIRMED, {
        variables: {
            gigId: id,
            eventId: event.id,
        },
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

    const paymentConfirmed = () => {
        setPaymentConfirmed();
        onPaymentConfirmed && onPaymentConfirmed();
        setIsPaid(true);
        tracker.trackEventPaid(offer.totalPayment.amount);
        ReactPixel.track('Purchase', {
            currency: currency,
            value: offer.totalPayment.amount,
        });
    };

    if (isPaid) {
        return <ThankYouContent style={size} translate={translate} />;
    }

    return (
        <PayFormContainer className="pay-form" ref={div}>
            <div className="left">
                {(!paymentIntent || !paymentType) && canSelectPayment ? (
                    <PaymentMethodSelect
                        {...props}
                        setPaymentType={setPaymentType}
                        paymentType={paymentType}
                        loading={loading}
                    />
                ) : null}
                {paymentType && paymentIntent && (
                    <BankPayForm
                        {...props}
                        chosenMethod={chosenMethod}
                        paymentIntent={paymentIntent}
                        paymentConfirmed={paymentConfirmed}
                        goBack={canSelectPayment ? () => setPaymentType(null) : false}
                        canBePaid={canBePaid}
                    />
                )}
                {!canSelectPayment && loading ? (
                    <LoadingPaymentInitial translate={translate} />
                ) : null}
            </div>

            <div className="right">
                {!loading && showCurrencyChange && (
                    <p className="notice">
                        This DJ uses a different currency, you might getter a better deal by paying
                        in {recommendedCurrency}.{' '}
                        <a
                            href="#recommended"
                            onClick={(_) => {
                                changeCurrency(recommendedCurrency);
                            }}
                        >
                            Change to {recommendedCurrency}
                        </a>
                    </p>
                )}

                <MoneyTable>
                    <TableItem
                        payLater={payLater}
                        label={
                            payLater ? (
                                <>
                                    <span>{translate('Pay later')}</span>
                                    {translate('DJ price')}
                                </>
                            ) : (
                                translate('DJ price')
                            )
                        }
                    >
                        {offer.offer.formatted}
                    </TableItem>
                    <TableItem
                        label={translate('Service fee')}
                        info={<div>{translate('event.offer.fee')}</div>}
                    >
                        {offer.serviceFee.formatted}
                    </TableItem>
                    <TableItem label={payLater ? 'Payment now' : 'Total'}>
                        {payLater ? offer.serviceFee.formatted : offer.totalPayment.formatted}
                    </TableItem>
                </MoneyTable>

                <p className="terms_link">{translate('event.offer.terms')}</p>
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
                text={translate('event.offer.payment-info')}
            />
            <Col center>
                <LoadingIndicator label={translate('gettingPayment')} />
            </Col>
        </>
    );
};

const PaymentMethodSelect = (props) => {
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
                            "The DJ will handle the payment, and you'll only pay the service fee now.",
                        value: PAYOUT_TYPES.DIRECT,
                    },
                ]}
            />
            <RowMobileCol right>
                <SmartButton
                    level="primary"
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
    return (
        <div className="payment-confirmation" style={style}>
            <Checkmark color={'#50E3C2'} fontSize="42px" />
            <h3>{translate('payment-succes-message')}</h3>
        </div>
    );
};

function mapStateToProps(state, ownprops) {
    return {
        translate: getTranslate(state.locale),
        currentLanguage: getActiveLanguage(state.locale).code,
        currency: state.session.currency,
    };
}

function mapDispatchToProps(dispatch, ownprops) {
    return {
        changeCurrency: (currency) => {
            dispatch(actions.changeCurrency(currency));
        },
    };
}

const SmartPay = connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentWrapper);

export default addTranslate(SmartPay, [content, requestFormContent]);
