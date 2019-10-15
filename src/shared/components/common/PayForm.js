import React, { useRef, useState } from 'react';
import useComponentSize from '@rehooks/component-size';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { Query, useMutation } from 'react-apollo';
import ReactPixel from 'react-facebook-pixel';
import { REQUEST_PAYMENT_INTENT, PAYMENT_CONFIRMED } from '../../routes/Event/gql';
import * as tracker from '../../utils/analytics/autotrack';
import { changeCurrency } from '../../actions/SessionActions';
import addTranslate from '../higher-order/addTranslate';
import content from '../../routes/Event/content.json';
import TextWrapper from './TextElement';
import MoneyTable, { TableItem } from './MoneyTable';
import StripeFormWrapper from './StripePayForm';
import XenditPayForm from './XenditPayForm';
import { LoadingPlaceholder2, LoadingIndicator } from './LoadingPlaceholder';
import requestFormContent from './RequestForm/content.json';
import NotifyPayment from './NotifyPayment';

const PayForm = ({
    translate,
    event,
    onPaymentConfirmed,
    currency,
    offer,
    changeCurrency,
    id,
    currentLanguage,
}) => {
    const div = useRef();
    const size = useComponentSize(div);
    const [isPaid, setIsPaid] = useState(false);

    const [setPaymentConfirmed] = useMutation(PAYMENT_CONFIRMED, {
        variables: {
            gigId: id,
            eventId: event.id,
        },
    });

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

    return (
        <div className="pay-form" ref={div}>
            <Query query={REQUEST_PAYMENT_INTENT} variables={variables} onError={console.log}>
                {({ data = {}, loading, error }) => {
                    if (error) {
                        return null;
                    }

                    const { requestPaymentIntent = {} } = data;
                    const { recommendedCurrency, offer } = requestPaymentIntent;
                    const showCurrencyChange = currency && recommendedCurrency !== currency;

                    const PayForms = {
                        STRIPE: (
                            <StripeFormWrapper
                                onPaymentConfirmed={paymentConfirmed}
                                paymentIntent={requestPaymentIntent}
                            />
                        ),
                        XENDIT: (
                            <XenditPayForm
                                onPaymentConfirmed={paymentConfirmed}
                                paymentIntent={requestPaymentIntent}
                            />
                        ),
                    };

                    return (
                        <>
                            <div className="left">
                                <TextWrapper
                                    label={translate('Pay')}
                                    showLock={true}
                                    text={translate('event.offer.payment-info')}
                                />
                                {loading ? (
                                    <LoadingIndicator label={translate('gettingPayment')} />
                                ) : (
                                    PayForms[requestPaymentIntent.paymentProvider]
                                )}
                            </div>

                            <div className="right">
                                {!loading && showCurrencyChange && (
                                    <p className="notice">
                                        This DJ uses a different currency, you might getter a better
                                        deal by paying in {recommendedCurrency}.{' '}
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
                                {loading ? (
                                    <LoadingPlaceholder2 />
                                ) : (
                                    <MoneyTable>
                                        <TableItem label={translate('DJ price')}>
                                            {offer.offer.formatted}
                                        </TableItem>
                                        <TableItem
                                            label={translate('Service fee')}
                                            info={<div>{translate('event.offer.fee')}</div>}
                                        >
                                            {offer.serviceFee.formatted}
                                        </TableItem>
                                        <TableItem label="Total">
                                            {offer.totalPayment.formatted}
                                        </TableItem>
                                    </MoneyTable>
                                )}

                                <p className="terms_link">{translate('event.offer.terms')}</p>
                            </div>
                        </>
                    );
                }}
            </Query>
        </div>
    );
};

const ThankYouContent = ({ translate, style }) => {
    return (
        <div className="payment-confirmation" style={style}>
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
)(PayForm);

export default addTranslate(SmartPay, [content, requestFormContent]);
