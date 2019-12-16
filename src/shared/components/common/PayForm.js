import React, { useRef, useState, useEffect } from 'react';
import useComponentSize from '@rehooks/component-size';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { Query, useMutation, useLazyQuery } from 'react-apollo';
import ReactPixel from 'react-facebook-pixel';
import Checkmark from 'react-ionicons/lib/IosCheckmarkCircle';
import styled, { css } from 'styled-components';
import {
    LoadingIndicator,
    Row,
    SmartButton,
    PrimaryButton,
    Col,
    RowMobileCol,
} from 'components/Blocks';
import { Label } from 'components/FormComponents';
import { Body, BodyBold } from 'components/Text';
import { PAYOUT_TYPES } from 'constants/constants';
import { REQUEST_PAYMENT_INTENT, PAYMENT_CONFIRMED } from '../../routes/Event/gql';
import * as tracker from '../../utils/analytics/autotrack';
import { changeCurrency } from '../../actions/SessionActions';
import addTranslate from '../higher-order/addTranslate';
import content from '../../routes/Event/content.json';
import TextWrapper from './TextElement';
import MoneyTable, { TableItem } from './MoneyTable';
import StripeFormWrapper from './StripePayForm';
import XenditPayForm from './XenditPayForm';
import { LoadingPlaceholder2 } from './LoadingPlaceholder';
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
}) => {
    const canBePaid = offer.daysUntilPaymentPossible < 1;

    if (!canBePaid) {
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
        <>
            <TextWrapper
                label={translate('Pay')}
                showLock={true}
                text={translate('event.offer.payment-info')}
            />
            {PayForms[paymentIntent.paymentProvider]}
        </>
    );
};

const PaymentWrapper = (props) => {
    const {
        offer,
        translate,
        onPaymentConfirmed,
        currency,
        id,
        event,
        gig,
        currentLanguage,
    } = props;
    const { availablePayoutMethods } = gig ?? {};
    const div = useRef();
    const size = useComponentSize(div);
    const [isPaid, setIsPaid] = useState(false);
    const [requestPaymentIntent, { loading, data }] = useLazyQuery(REQUEST_PAYMENT_INTENT);
    const [paymentType, setPaymentType] = useState();
    const [chosen, setChosen] = useState(PAYOUT_TYPES.BANK);

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
                    locale: currentLanguage,
                    paymentType,
                },
            });
        }
    }, [availablePayoutMethods, currentLanguage, id, paymentType, requestPaymentIntent]);

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

    const { requestPaymentIntent: paymentIntent } = data ?? {};
    const { recommendedCurrency } = paymentIntent ?? {};
    const showCurrencyChange = currency && recommendedCurrency !== currency;

    const payLater = chosen === PAYOUT_TYPES.DIRECT;

    return (
        <PayFormContainer className="pay-form" ref={div}>
            <div className="left">
                {!paymentIntent || !paymentType ? (
                    <PaymentMethodSelect
                        {...props}
                        setPaymentType={setPaymentType}
                        chosen={chosen}
                        setChosen={setChosen}
                        loading={loading}
                    />
                ) : (
                    <BankPayForm
                        {...props}
                        paymentIntent={paymentIntent}
                        paymentConfirmed={paymentConfirmed}
                        goBack={() => setPaymentType(null)}
                    />
                )}
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

const PaymentMethodSelect = (props) => {
    const { translate, chosen, setChosen, loading, setPaymentType } = props;

    return (
        <div>
            <TextWrapper label={translate('Pay-method')} showLock={true} />
            <div style={{ marginBottom: '30px' }}>
                <MethodButton
                    checked={chosen === PAYOUT_TYPES.BANK}
                    title={'Pay now'}
                    description={
                        "Cueup will facilitate your payment. You'll pay today after completing the booking."
                    }
                    onClick={() => setChosen(PAYOUT_TYPES.BANK)}
                />
                <MethodButton
                    checked={chosen === PAYOUT_TYPES.DIRECT}
                    title={'Pay later'}
                    description={
                        "The DJ will handle the payment, and you'll only pay the service fee now."
                    }
                    onClick={() => setChosen(PAYOUT_TYPES.DIRECT)}
                />
            </div>
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

const MethodButton = ({ title, description, checked, onClick }) => {
    return (
        <MethodWrapper onClick={onClick}>
            <RadioIndicator checked={checked} />
            <Col>
                <BodyBold bold>{title}</BodyBold>
                <Body>{description}</Body>
            </Col>
        </MethodWrapper>
    );
};

const RadioIndicator = styled.div`
    height: 25px;
    width: 25px;
    min-width: 25px;
    min-height: 25px;
    border-radius: 25px;
    border: 3px solid #98a4b3;
    display: inline-block;
    margin-right: 1em;
    margin-top: 0.2em;
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ checked }) =>
        checked &&
        css`
            border-color: #31daff;
            &:after {
                position: absolute;
                content: '';
                height: 13px;
                width: 13px;
                background: #31daff;
                border-radius: 100%;
            }
        `}
`;

const MethodWrapper = styled(Row)`
    background-color: #edf2f7;
    padding: 1em;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
        background-color: #e6edf4;
    }
    &:nth-child(2) {
        margin-top: 15px;
    }
`;

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
    };
}

function mapDispatchToProps(dispatch, ownprops) {
    return {
        changeCurrency: (currency) => {
            dispatch(changeCurrency(currency));
        },
    };
}

const SmartPay = connect(
    mapStateToProps,
    mapDispatchToProps
)(PaymentWrapper);

export default addTranslate(SmartPay, [content, requestFormContent]);
