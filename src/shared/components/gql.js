import gql from 'graphql-tag';

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
                averageRating
                rating
                experience
                hasInstalledApp
                instagramConnected
                soundCloudConnected
                earned {
                    amount
                    currency
                    formatted
                }
                roles
            }
            userMetadata {
                firstName
                lastName
                bio
                birthday
                phone
                bankAccount {
                    last4
                }
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
        $firstName: String!
        $lastName: String!
        $playingLocation: Area!
        $genres: [String!]!
        $experienceLevel: ExperienceLevel
        $bio: String!
        $redirectLink: String!
        $profilePicture: ID!
        $phone: String
    ) {
        signUp(
            email: $email
            password: $password
            redirectLink: $redirectLink
            firstName: $firstName
            lastName: $lastName
            playingLocation: $playingLocation
            genres: $genres
            experienceLevel: $experienceLevel
            bio: $bio
            profilePicture: $profilePicture
            phone: $phone
        )
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

const AVAILABLE_BANKS = gql`
    query banks($countryCode: String!) {
        availableBanks(countryCode: $countryCode)
    }
`;

const USER_BANK_ACCOUNT = gql`
    query UserBankAccount {
        me {
            id
            userMetadata {
                bankAccount {
                    last4
                    currency
                    accountHolderName
                    bankName
                    bankCode
                    countryCode
                    status
                }
            }
        }
    }
`;

const UPDATE_USER_PAYOUT = gql`
    mutation updateUserPayout(
        $id: ID!
        $payoutInfo: JSON!
        $paymentProvider: PaymentProvider!
        $phone: String
    ) {
        updateUser(
            id: $id
            payoutInfo: $payoutInfo
            paymentProvider: $paymentProvider
            phone: $phone
        ) {
            id
            userMetadata {
                phone
                bankAccount {
                    last4
                    currency
                    accountHolderName
                    bankName
                    bankCode
                    countryCode
                    status
                }
            }
            appMetadata {
                earned {
                    amount
                    currency
                }
            }
            userSettings {
                currency
            }
        }
    }
`;

const MY_GIGS = gql`
    query MyGigs($limit: Int, $page: Int, $currency: Currency, $locale: String) {
        myGigs(pagination: { limit: $limit, page: $page }) {
            __typename
            edges {
                id
                statusHumanized
                status
                offer {
                    offer(currency: $currency) {
                        amount
                        currency
                        formatted
                    }
                }
                event {
                    id
                    name
                    description
                    start {
                        localDate
                        formattedTime(locale: $locale)
                        formattedDate(locale: $locale)
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

const PAY_EVENT = gql`
    mutation PayEvent($gigId: ID!, $paymentData: JSON!, $paymentProvider: PaymentProvider!) {
        payEvent(gigId: $gigId, paymentData: $paymentData, paymentProvider: $paymentProvider) {
            id
            status
        }
    }
`;

export {
    AVAILABLE_BANKS,
    LOGIN,
    ME,
    REQUEST_PASSWORD_RESET,
    RESET_PASSWORD,
    CREATE_USER,
    REQUEST_EMAIL_VERIFICATION,
    VERIFY_EMAIL,
    USER_BANK_ACCOUNT,
    UPDATE_USER_PAYOUT,
    MY_GIGS,
    PAY_EVENT,
};
