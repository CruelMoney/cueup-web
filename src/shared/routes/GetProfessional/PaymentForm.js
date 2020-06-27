import React, { useEffect, useState, useCallback } from 'react';
import {
    CardElement,
    Elements,
    PaymentRequestButtonElement,
    useStripe,
} from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import styled from 'styled-components';
import { PrimaryButton, inputStyle } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { useServerContext } from 'components/hooks/useServerContext';

function PaymentForm({ selectedTier }) {
    return (
        <div>
            <PaymentRequestButtonWrapper selectedTier={selectedTier} />
            <CardWrapper>
                <CardElement options={inputOptions} />
            </CardWrapper>
            <PrimaryButton disabled={!selectedTier}>
                {selectedTier ? `Buy now - ${selectedTier.price.formatted}` : 'Buy now'}
            </PrimaryButton>
            <BodySmall style={{ textAlign: 'center', marginTop: 12 }}>
                You will receive your money back each month, if you don't receive any gig requests.
                Cancel any time.
            </BodySmall>
        </div>
    );
}

const PaymentRequestButtonWrapper = ({ selectedTier }) => {
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

            pmRq.on('paymentmethod', (ev) => {
                const applePayId = ev.paymentMethod.id;

                // TODO: attach to customer
            });
        }
    }, [stripe, selectedTier]);

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
