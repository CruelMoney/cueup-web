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
