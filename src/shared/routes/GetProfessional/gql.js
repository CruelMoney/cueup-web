import gql from 'graphql-tag';

export const SUBSCRIPTION_TIERS = gql`
    query SubscriptionTiers {
        subscriptionTiers {
            id
            name
            description
            interval
            price {
                amount
                formatted
                currency
            }
            beforePriceMonthly {
                amount
                formatted
            }
            priceMonthly {
                amount
                formatted
            }
            discount {
                amount {
                    amount
                    formatted
                }
                code
            }
        }
    }
`;

export const START_SUBSCRIPTION = gql`
    mutation StartSubscription($tierId: ID!, $paymentData: PaymentData!) {
        startSubscription(tierId: $tierId, paymentData: $paymentData) {
            paymentIntent
            requiresConfirmation
        }
    }
`;

export const SUBSCRIPTION_CONFIRMED = gql`
    mutation SubscriptionConfirmed {
        subscriptionConfirmed @client
    }
`;
