/* eslint-disable camelcase */
import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
    CardElement,
    Elements,
    PaymentRequestButtonElement,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';

import styled from 'styled-components';
import * as Sentry from '@sentry/react';
import { Input, InputRow, LabelHalf } from 'components/FormComponents';
import { validators, useForm } from 'components/hooks/useForm';
import { inputStyle, SmartButton, TeritaryButton, RowMobileCol, Hr } from 'components/Blocks';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import CountrySelector from './CountrySelector';
import ErrorMessageApollo from './ErrorMessageApollo';

const StripeForm = ({ onPaymentConfirmed, goBack, paymentIntent }) => {
    const stripe = useStripe();
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
            console.log(error);
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
        if (result.error) {
            console.log(result.error);
            throw new Error(result.error.message || 'Something went wrong');
        }
        onPaymentConfirmed();
        return result.paymentIntent;
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
                            Go Back
                        </TeritaryButton>
                    )}
                    <SmartButton type="submit" loading={loading} onClick={confirmPayment}>
                        {translate('Confirm & Pay')}
                    </SmartButton>
                </RowMobileCol>
                <ErrorMessageApollo error={error} />
            </div>
        </form>
    );
};

const PaymentRequestButtonWrapper = ({ paymentIntent, onPaymentConfirmed }) => {
    const stripe = useStripe();
    const { offer } = paymentIntent;

    const [paymentRequest, setPaymentRequest] = useState(null);

    const confirmPaymentRequest = useCallback(
        async ({ complete, paymentMethod }) => {
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
        },
        [stripe, onPaymentConfirmed, paymentIntent]
    );

    useEffect(() => {
        // For full documentation of the available paymentRequest options, see:
        // https://stripe.com/docs/stripe.js#the-payment-request-object
        if (stripe && offer) {
            const { totalPayment, serviceFee, offer: innerOffer } = offer;

            const pmRq = stripe.paymentRequest({
                currency: totalPayment.currency.toLowerCase(),
                country: 'DK',
                total: {
                    label: 'Total',
                    amount: parseInt(totalPayment.amount),
                },
                displayItems: [
                    {
                        label: 'DJ offer',
                        amount: parseInt(innerOffer.amount),
                    },
                    {
                        label: 'Service fee',
                        amount: parseInt(serviceFee.amount),
                    },
                ],
                requestPayerName: true,
                requestPayerEmail: true,
            });

            pmRq.on('paymentmethod', confirmPaymentRequest);

            // Check the availability of the Payment Request API.
            pmRq.canMakePayment().then((result) => {
                if (result) {
                    setPaymentRequest(pmRq);
                }
            });
        }
    }, [stripe, offer, confirmPaymentRequest]);

    if (!paymentRequest || !stripe) {
        return null;
    }

    return (
        <>
            <PaymentRequestButtonElement
                options={{
                    paymentRequest,
                    style: {
                        paymentRequestButton: {
                            theme: 'dark',
                            height: '40px',
                        },
                    },
                }}
                className="PaymentRequestButton"
            />
            <div className="or-divider">
                <Hr />
                <span>OR</span>
            </div>
        </>
    );
};

const StripeFormWrapper = (props) => {
    const { environment } = useServerContext();

    const stripePromise = loadStripe(environment.STRIPE_PUBLIC_KEY);

    return (
        <Elements stripe={stripePromise}>
            <PaymentRequestButtonWrapper {...props} />
            <StripeForm {...props} />
        </Elements>
    );
};

const ConnectedCard = ({ refForward, onSave }) => {
    const [error, setError] = useState();
    return (
        <LabelHalf>
            <Wrapper error={error}>
                <CardElement
                    options={{
                        style: {
                            base: {
                                'color': '#32325d',
                                'fontFamily':
                                    'Avenir Next, Open Sans, Segoe UI, Helvetica, sans-serif',
                                'fontSmoothing': 'antialiased',
                                'fontWeight': '400',
                                'fontSize': '18px',
                                'lineHeight': '40px',
                                '::placeholder': {
                                    color: '#98a4b3',
                                    opacity: 1,
                                },
                            },
                            invalid: {
                                color: '#f44336',
                                iconColor: '#f44336',
                            },
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
