import React, { useEffect, useState, useCallback } from 'react';
import {
    CardElement,
    Elements,
    PaymentRequestButtonElement,
    useStripe,
    useElements,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { captureException } from '@sentry/core';
import { inputStyle, SmartButton } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { useServerContext } from 'components/hooks/useServerContext';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import { START_SUBSCRIPTION, SUBSCRIPTION_CONFIRMED } from './gql';

function PaymentForm({ selectedTier }) {
    const [error, setError] = useState();
    const [loading, setLoading] = useState(false);
    const stripe = useStripe();
    const elements = useElements();

    const [subscriptionConfirmed] = useMutation(SUBSCRIPTION_CONFIRMED);

    // if the customer needs to confirm using 3d secure etc
    const confirmCardPayment = useCallback(
        async (pIntent) => {
            try {
                setLoading(true);

                const card = elements.getElement(CardElement);
                const { paymentMethod } = await stripe.createPaymentMethod({
                    type: 'card',
                    card,
                });

                const { error, paymentIntent } = await stripe.confirmCardPayment(
                    pIntent.client_secret,
                    {
                        payment_method: paymentMethod.id,
                    }
                );

                if (error) {
                    // Start code flow to handle updating the payment details.
                    // Display error message in your UI.
                    // The card was declined (i.e. insufficient funds, card has expired, etc).
                    setError(error);
                } else {
                    if (paymentIntent.status === 'succeeded') {
                        // Show a success message to your customer.
                        // There's a risk of the customer closing the window before the callback.
                        // We recommend setting up webhook endpoints later in this guide.
                        subscriptionConfirmed();
                    }
                }
            } catch (error) {
                captureException(error);
                setError(error);
            } finally {
                setLoading(false);
            }
        },
        [stripe, elements, subscriptionConfirmed]
    );

    const [startSubscription] = useMutation(START_SUBSCRIPTION, {
        onCompleted: ({ startSubscription }) => {
            if (startSubscription.requiresConfirmation) {
                confirmCardPayment(startSubscription.paymentIntent);
            } else {
                setLoading(false);
                subscriptionConfirmed();
            }
        },
    });

    const submit = async (event) => {
        try {
            event.preventDefault();

            setError(null);
            setLoading(true);

            const card = elements.getElement(CardElement);
            const { error, paymentMethod } = await stripe.createPaymentMethod({
                type: 'card',
                card,
            });

            if (error) {
                console.log(error);
                setError(error.message);
            } else {
                await startSubscription({
                    variables: {
                        tierId: selectedTier?.id,
                        paymentData: {
                            paymentMethodId: paymentMethod.id,
                        },
                    },
                });
            }
        } catch (error) {
            console.log(error);
            setError(error);
            setLoading(false);
            captureException(error);
        }
    };

    return (
        <div>
            <PaymentRequestButtonWrapper
                selectedTier={selectedTier}
                startSubscription={startSubscription}
            />
            <form onSubmit={submit}>
                <CardWrapper>
                    <CardElement options={inputOptions} />
                </CardWrapper>
                <ErrorMessageApollo error={error} />

                <SmartButton
                    data-cy="submit-button"
                    loading={loading}
                    level="primary"
                    disabled={!selectedTier}
                    onClick={submit}
                >
                    {selectedTier ? `Buy now - ${selectedTier.price.formatted}` : 'Buy now'}
                </SmartButton>
            </form>
            <BodySmall style={{ textAlign: 'center', marginTop: 12 }}>
                You will receive your money back each month, if you don't receive any gig requests.
                Cancel any time.
            </BodySmall>
        </div>
    );
}

const PaymentRequestButtonWrapper = ({ selectedTier, startSubscription }) => {
    const stripe = useStripe();

    const [paymentRequest, setPaymentRequest] = useState(null);

    useEffect(() => {
        if (stripe && selectedTier) {
            const { price } = selectedTier;

            const pmRq = stripe.paymentRequest({
                currency: price.currency.toLowerCase(),
                country: 'DK',
                total: {
                    label: 'Total',
                    amount: parseInt(price.amount),
                },

                requestPayerName: true,
                requestPayerEmail: true,
            });

            // Check the availability of the Payment Request API.
            pmRq.canMakePayment().then((result) => {
                if (result) {
                    setPaymentRequest(pmRq);
                }
            });

            pmRq.on('paymentmethod', ({ paymentMethod }) => {
                startSubscription({
                    variables: {
                        tierId: selectedTier.id,
                        paymentData: {
                            paymentMethodId: paymentMethod.id,
                        },
                    },
                });
            });
        }
    }, [stripe, selectedTier, startSubscription]);

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
                <hr />
                <span style={{ backgroundColor: '#f6f8f9' }}>OR</span>
            </div>
        </>
    );
};

const inputOptions = {
    style: {
        base: {
            'color': '#32325d',
            'fontFamily': 'Avenir Next, Open Sans, Segoe UI, Helvetica, sans-serif',
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
};

const CardWrapper = styled.div`
    ${inputStyle}
    padding-left: 9px;
    background-color: #fff;
    margin-bottom: 15px;
    height: 40px;
`;

const Wrapper = (props) => {
    const { environment } = useServerContext();

    const stripePromise = loadStripe(environment.STRIPE_PUBLIC_KEY);

    return (
        <Elements stripe={stripePromise}>
            <PaymentForm {...props} />
        </Elements>
    );
};

export default Wrapper;
