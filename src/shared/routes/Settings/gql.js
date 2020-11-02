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

export const UPDATE_USER = gql`
    mutation updateUser(
        $id: ID!
        $email: EmailAddress
        $firstName: String
        $lastName: String
        $phone: String
        $picture: Upload
        $profilePicture: ID
        $coverPhoto: Upload
        $playingLocation: Area
        $genres: [String!]
        $bio: String
        $redirectLink: String
        $birthday: DateTime
        $password: String
        $artistName: String
        $permalink: String
        $standby: Boolean
        $cancelationDays: Int
        $refundPercentage: Int
        $currency: Currency
        $notificationSettings: JSON
        $publicDisplaySettings: JSON
        $playedVenues: [String!]
        $taxType: String
        $taxId: String
        $website: URL
    ) {
        updateUser(
            id: $id
            email: $email
            redirectLink: $redirectLink
            firstName: $firstName
            lastName: $lastName
            picture: $picture
            profilePicture: $profilePicture
            coverPhoto: $coverPhoto
            playingLocation: $playingLocation
            genres: $genres
            bio: $bio
            phone: $phone
            birthday: $birthday
            password: $password
            artistName: $artistName
            permalink: $permalink
            standby: $standby
            cancelationDays: $cancelationDays
            refundPercentage: $refundPercentage
            currency: $currency
            notificationSettings: $notificationSettings
            publicDisplaySettings: $publicDisplaySettings
            playedVenues: $playedVenues
            taxType: $taxType
            taxId: $taxId
            website: $website
        ) {
            id
            email
            permalink
            artistName
            genres
            playedVenues
            picture {
                path
            }
            coverPhoto {
                path
            }
            playingLocation {
                name
                radius
                longitude
                latitude
            }
            userMetadata {
                firstName
                lastName
                bio
                birthday
                phone
                website
            }
            appMetadata {
                profileStatus
                approved
                onboarded
            }
            userSettings {
                currency
                standby
                notifications
                publicDisplay
                cancelationPolicy {
                    days
                    percentage
                }
            }
            edits {
                id
                status
                fieldName
                message
            }
        }
    }
`;

export const ME_SETTINGS = gql`
    query MeSettings {
        me {
            id
            isDj @client
            isOwn @client
            email
            permalink
            genres
            artistName
            picture {
                path
            }
            coverPhoto {
                path
            }
            playingLocation {
                name
                radius
                longitude
                latitude
            }
            appMetadata {
                rating
                experience
                roles
                certified
                createdAt
                identityVerified
                hasInstalledApp
                instagramConnected
                soundCloudConnected
                mixcloudConnected
                earned {
                    amount
                    currency
                    formatted
                }
                roles
                profileStatus
                approved
                onboarded
                isPro
            }
            userMetadata {
                firstName
                lastName
                fullName
                bio
                birthday
                phone
                website
            }
            payoutMethods {
                id
                payoutType
                paymentProvider
            }
            userSettings {
                currency
                notifications
                publicDisplay
                standby
                cancelationPolicy {
                    days
                    percentage
                }
            }
        }
    }
`;
