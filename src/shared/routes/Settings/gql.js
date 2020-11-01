import { gql } from '@apollo/client';

export const MANAGE_SUBSCRIPTION = gql`
    query ManageSubscription($redirectUrl: String!) {
        manageSubscription(redirectUrl: $redirectUrl)
    }
`;

export const DELETE_USER = gql`
    mutation DeleteUser($id: ID!) {
        deleteUser(id: $id)
    }
`;

export const VERIFY_STATUS = gql`
    query VerifyStatus {
        me {
            id
            appMetadata {
                identityVerified
                identityStatus {
                    details
                    status
                }
            }
            userMetadata {
                firstName
                lastName
                birthday
                address
                countryCode
                postalCode
                city
                phone
            }
        }
    }
`;

export const REQUEST_VERIFICATION = gql`
    mutation RequestVerification(
        $id: ID!
        $firstName: String!
        $lastName: String!
        $birthday: DateTime!
        $address: String!
        $state: String
        $city: String!
        $countryCode: String!
        $postalCode: String!
        $documentFront: Upload!
        $documentBack: Upload
        $ssnLast4: String
        $phone: String
    ) {
        updateUser(
            id: $id
            firstName: $firstName
            lastName: $lastName
            birthday: $birthday
            phone: $phone
            requestVerification: {
                address: $address
                city: $city
                countryCode: $countryCode
                state: $state
                postalCode: $postalCode
                documentFront: $documentFront
                documentBack: $documentBack
                ssnLast4: $ssnLast4
            }
        ) {
            id
            appMetadata {
                identityVerified
                identityStatus {
                    details
                    status
                }
            }
            userMetadata {
                firstName
                lastName
                birthday
                address
                countryCode
                postalCode
                city
                phone
            }
        }
    }
`;
