import gql from 'graphql-tag';

const UPDATE_USER_PAYOUT = gql`
    mutation UpdateUserPayout($provider: PaymentProvider!, $type: PayoutType!, $data: JSON!) {
        updatePayoutMethod(provider: $provider, type: $type, data: $data) {
            id
            paymentProvider
            ... on Bank {
                last4
                currency
                accountHolderName
                bankName
                bankCode
                countryCode
                status
            }
            ... on Direct {
                description
            }
        }
    }
`;

const USER_PAYOUT_DATA = gql`
    query PayoutData {
        me {
            id
            userMetadata {
                phone
                firstName
                lastName
            }
        }
        availableBankCountries {
            countryCode
            defaultCurrency
            supportedCurrencies
            labels
        }
    }
`;

const USER_PAYOUT_METHOD = gql`
    query UserPayoutMethods($id: ID!) {
        me {
            id
            userMetadata {
                phone
                firstName
                lastName
            }
        }
        availableBankCountries {
            countryCode
            defaultCurrency
            supportedCurrencies
            labels
        }
        payoutMethod(id: $id) {
            id
            paymentProvider
            ... on Bank {
                last4
                currency
                accountHolderName
                bankName
                bankCode
                countryCode
                status
            }
            ... on Direct {
                description
            }
        }
    }
`;

const AVAILABLE_BANKS = gql`
    query AvailableBanks($countryCode: String!) {
        availableBanks(countryCode: $countryCode)
    }
`;

const REMOVE_PAYOUT_METHOD = gql`
    mutation RemovePayoutMethod($id: ID!) {
        removePayoutMethod(id: $id)
    }
`;

export {
    UPDATE_USER_PAYOUT,
    AVAILABLE_BANKS,
    REMOVE_PAYOUT_METHOD,
    USER_PAYOUT_DATA,
    USER_PAYOUT_METHOD,
};
