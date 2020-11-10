import { gql } from '@apollo/client';

const ME = gql`
    query Me {
        me {
            id
            isDj @client
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
            }
            payoutMethods {
                id
                payoutType
                paymentProvider
            }
            userSettings {
                currency
                notifications
                standby
                cancelationPolicy {
                    days
                    percentage
                }
            }
        }
    }
`;

const LOGIN = gql`
    mutation Signin($email: EmailAddress!, $password: String!) {
        signIn(email: $email, password: $password) {
            token
        }
    }
`;

const CREATE_USER = gql`
    mutation CreateUser(
        $email: EmailAddress!
        $password: String!
        $firstName: String
        $lastName: String
        $artistName: String
        $playingLocation: Area
        $genres: [String!]
        $experienceLevel: ExperienceLevel
        $bio: String
        $redirectLink: String!
        $profilePicture: ID
        $phone: String
    ) {
        signUpToken(
            email: $email
            password: $password
            redirectLink: $redirectLink
            firstName: $firstName
            lastName: $lastName
            artistName: $artistName
            playingLocation: $playingLocation
            genres: $genres
            experienceLevel: $experienceLevel
            bio: $bio
            profilePicture: $profilePicture
            phone: $phone
        ) {
            token
        }
    }
`;

const REQUEST_EMAIL_VERIFICATION = gql`
    mutation requestVerifyEmail($email: EmailAddress!, $redirectLink: String!) {
        requestVerifyEmail(email: $email, redirectLink: $redirectLink)
    }
`;

const REQUEST_PASSWORD_RESET = gql`
    mutation requestPasswordReset($email: EmailAddress!, $redirectLink: String!) {
        requestPasswordReset(email: $email, redirectLink: $redirectLink)
    }
`;

const RESET_PASSWORD = gql`
    mutation resetUserPassword($token: String!, $password: String!) {
        resetUserPassword(passwordResetToken: $token, password: $password) {
            token
        }
    }
`;

const VERIFY_EMAIL = gql`
    mutation VerifyEmail($verifyToken: String!) {
        verifyEmail(verifyToken: $verifyToken)
    }
`;

const MY_GIGS = gql`
    query MyGigs(
        $pagination: Pagination
        $currency: Currency
        $locale: String
        $filter: GigFilter
    ) {
        myGigs(pagination: $pagination, filter: $filter) {
            __typename
            edges {
                id
                statusHumanized
                status
                referred
                offer {
                    offer(currency: $currency) {
                        amount
                        currency
                        formatted
                    }
                    totalPayout(currency: $currency) {
                        amount
                        currency
                    }
                }

                event {
                    id
                    name
                    description
                    createdAt {
                        UTC
                    }
                    location {
                        name
                    }
                    start {
                        localDate
                        formattedTime(locale: $locale)
                        formattedDate(locale: $locale)
                    }
                    duration {
                        humanized
                        formatted
                    }
                    organizer {
                        userMetadata {
                            firstName
                        }
                    }
                }
            }
            pageInfo {
                hasPrevPage
                hasNextPage
                page
                totalPages
                prevPage
                nextPage
                totalDocs
            }
        }
    }
`;

export const MY_ACTIVE_GIGS = gql`
    query MyActiveGigs {
        myGigs(
            pagination: { page: 1, limit: 999 }
            filter: { status: [REQUESTED, ACCEPTED, CONFIRMED] }
        ) {
            __typename
            edges {
                id
                status
                hasUnreadMessage
                chatInitiated
                event {
                    id
                    name
                    hash
                    start {
                        UTC
                    }
                    chosenGig {
                        id
                    }
                    organizer {
                        id
                        userMetadata {
                            firstName
                        }
                        picture {
                            path
                        }
                    }
                }
            }
            pageInfo {
                totalDocs
            }
        }
        opportunities(pagination: { page: 1, limit: 999 }) {
            __typename
            pageInfo {
                totalDocs
            }
        }
    }
`;

const PAY_EVENT = gql`
    mutation PayEvent($gigId: ID!, $paymentData: JSON!, $paymentProvider: PaymentProvider!) {
        payEvent(gigId: $gigId, paymentData: $paymentData, paymentProvider: $paymentProvider) {
            id
            status
        }
    }
`;

export {
    LOGIN,
    ME,
    REQUEST_PASSWORD_RESET,
    RESET_PASSWORD,
    CREATE_USER,
    REQUEST_EMAIL_VERIFICATION,
    VERIFY_EMAIL,
    MY_GIGS,
    PAY_EVENT,
};
