/* eslint-disable camelcase */
import React, { PureComponent, useState, useEffect, useRef } from 'react';
import {
    CardElement,
    injectStripe,
    Elements,
    StripeProvider,
    PaymentRequestButtonElement,
} from 'react-stripe-elements';
import styled from 'styled-components';
import * as Sentry from '@sentry/browser';
import { Input, InputRow, LabelHalf } from 'components/FormComponents';
import { validators, useForm } from 'components/hooks/useForm';
import { inputStyle, SmartButton, TeritaryButton, RowMobileCol } from 'components/Blocks';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import CountrySelector from './CountrySelector';
import ErrorMessageApollo from './ErrorMessageApollo';

const StripeForm = ({ stripe, onPaymentConfirmed, goBack }) => {
    const { translate } = useTranslate();
    const cardElement = useRef();
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);

    const { getInputProps, form, runValidations } = useForm();

    const confirmPayment = async (e) => {
        e.preventDefault();
        setError(null);

        const errors = runValidations();
        if (errors?.length) {
            return;
        }

        setLoading(true);

        const { card_email, card_name, card_country } = form;

        try {
            await handlePayment({
                email: card_email,
                name: card_name,
                country: card_country,
            });
            return false;
        } catch (error) {
            Sentry.captureException(error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async ({ email, name, country }) => {
        const { token } = paymentIntent;
        const PAYMENT_INTENT_CLIENT_SECRET = token.token;

        const options = {
            payment_method_data: {
                billing_details: {
                    address: {
                        country,
                    },
                    name,
                    email,
                },
            },
            receipt_email: email,
        };
        const result = await stripe.handleCardPayment(
            PAYMENT_INTENT_CLIENT_SECRET,
            cardElement.current,
            options
        );
        const { error, paymentIntent } = result;
        if (error) {
            throw new Error(error.message || 'Something went wrong');
        }
        onPaymentConfirmed();
        return paymentIntent;
    };

    return (
        <form name="pay-form" onSubmit={confirmPayment}>
            <PaymentRow small>
                <CountrySelector
                    noShadow
                    forceHeight={250}
                    {...getInputProps('card_country')}
                    validation={(v) => (!v ? 'Please select a country from the list' : null)}
                    placeholder={translate('country')}
                />

                <Input
                    half
                    type="email"
                    {...getInputProps('card_email')}
                    validation={[validators.required, validators.email]}
                    placeholder={translate('Billing email')}
                />

                <Input
                    half
                    type="text"
                    {...getInputProps('card_name')}
                    validation={[validators.required, validators.lastName]}
                    placeholder={translate('Cardholder name')}
                />

                <ConnectedCard
                    {...getInputProps('card_token')}
                    validation={[validators.required]}
                    refForward={cardElement}
                />
            </PaymentRow>

            <div style={{ marginTop: '16x' }}>
                <RowMobileCol right reverse>
                    {goBack && (
                        <TeritaryButton onClick={goBack} type="button">
                            Back
                        </TeritaryButton>
                    )}
                    <SmartButton type="submit" loading={loading}>
                        {translate('Confirm & Pay')}
                    </SmartButton>
                </RowMobileCol>
                <ErrorMessageApollo error={error} />
            </div>
        </form>
    );
};

const PaymentRequestButtonWrapper = ({ paymentIntent, stripe, onPaymentConfirmed }) => {
    const { offer } = paymentIntent;

    const [canMakePayment, setCanMakePayment] = useState(false);
    const paymentRequest = useRef();

    const confirmPaymentRequest = async ({ complete, paymentMethod }) => {
        try {
            const { token } = paymentIntent;
            const PAYMENT_INTENT_CLIENT_SECRET = token.token;

            complete('success');
            const result = await stripe.handleCardPayment(PAYMENT_INTENT_CLIENT_SECRET, {
                payment_method: paymentMethod.id,
            });
            const { error } = result;
            if (error) {
                console.log({ error });
                throw new Error(error.message || 'Something went wrong');
            }
            onPaymentConfirmed(true);
        } catch (error) {
            setTimeout(() => {
                alert(error.message);
            }, 1000);
            console.log({ error });
            complete('fail');
        }
    };

    useEffect(() => {
        // For full documentation of the available paymentRequest options, see:
        // https://stripe.com/docs/stripe.js#the-payment-request-object
        paymentRequest.current = stripe.paymentRequest({
            currency: offer.totalPayment.currency.toLowerCase(),
            country: 'DK',
            total: {
                label: 'Total',
                amount: offer.totalPayment.amount,
            },
            displayItems: [
                {
                    label: 'DJ offer',
                    amount: offer.offer.amount,
                },
                {
                    label: 'Service fee',
                    amount: offer.serviceFee.amount,
                },
            ],
            requestPayerName: true,
            requestPayerEmail: true,
        });

        paymentRequest.current.on('paymentmethod', confirmPaymentRequest);

        paymentRequest.current.canMakePayment().then((result) => {
            setCanMakePayment(!!result);
        });
    }, []); /* eslint-disable-line react-hooks/exhaustive-deps */

    if (!canMakePayment || !paymentRequest.current) {
        return null;
    }

    return (
        <>
            <PaymentRequestButtonElement
                paymentRequest={paymentRequest.current}
                className="PaymentRequestButton"
                style={{
                    paymentRequestButton: {
                        theme: 'dark',
                        height: '40px',
                    },
                }}
            />
            <div className="or-divider">
                <hr />
                <span>OR</span>
            </div>
        </>
    );
};

const PaymentRequestBtn = injectStripe(PaymentRequestButtonWrapper);

const SmartForm = injectStripe(StripeForm);

const StripeFormWrapper = (props) => {
    const { environment } = useServerContext();
    return (
        <StripeProvider apiKey={environment.STRIPE_PUBLIC_KEY}>
            <>
                <Elements>
                    <PaymentRequestBtn {...props} />
                </Elements>
                <Elements>
                    <SmartForm {...props} />
                </Elements>
            </>
        </StripeProvider>
    );
};

const ConnectedCard = ({ refForward, onSave }) => {
    const [error, setError] = useState();
    return (
        <LabelHalf>
            <Wrapper error={error}>
                <CardElement
                    style={{
                        base: {
                            'color': '#32325d',
                            'fontFamily': 'Open Sans, Segoe UI, Helvetica, sans-serif',
                            'fontSmoothing': 'antialiased',
                            'fontSize': '18px',
                            'lineHeight': '40px',
                            '::placeholder': {
                                color: '#98a4b3',
                            },
                        },
                        invalid: {
                            color: '#f44336',
                            iconColor: '#f44336',
                        },
                    }}
                    onReady={(el) => {
                        refForward.current = el;
                    }}
                    onChange={({ complete, error }) => {
                        setError(error?.message);
                        if (complete) {
                            onSave(true);
                        } else {
                            onSave(null);
                        }
                    }}
                />
            </Wrapper>
            <p className="error">{error}</p>
        </LabelHalf>
    );
};

const PaymentRow = styled(InputRow)`
    > * {
        margin-bottom: 12px;
        min-width: 200px;
    }
`;

const Wrapper = styled.div`
    ${inputStyle}
    padding-left: 9px;
`;

export default StripeFormWrapper;
