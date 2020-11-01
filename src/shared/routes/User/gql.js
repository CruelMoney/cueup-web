import { gql } from '@apollo/client';

const USER = gql`
    query User($permalink: String!) {
        user(permalink: $permalink) {
            id
            isOwn @client
            isDj @client
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
            media(pagination: { page: 1, limit: 5, orderBy: ORDER_KEY }, mediaType: IMAGE) {
                edges {
                    id
                    path
                    type
                    orderBy
                }
                pageInfo {
                    totalDocs
                }
            }
            sounds(pagination: { page: 1, limit: 1 }) {
                edges {
                    id
                    title
                    description
                    samples
                    tags
                    duration {
                        totalSeconds
                    }
                    file {
                        id
                        path
                    }
                }
                pageInfo {
                    totalDocs
                }
            }
            appMetadata {
                rating
                experience
                roles
                identityVerified
                certified
                createdAt
                instagramUsername
                soundCloudUsername
                soundCloudUrl
                mixcloudUsername
                mixcloudUrl
                followers {
                    total
                    totalFormatted
                }
                isPro
            }
            userMetadata {
                firstName
                lastName
                bio
                birthday
                phone
                website
            }
            userSettings {
                standby
                currency
                publicDisplay
                cancelationPolicy {
                    days
                    percentage
                }
            }
            reviews {
                pageInfo {
                    totalDocs
                }
            }
            highlightedReview {
                title
                citation
                content
                rating
                author {
                    picture {
                        path
                    }
                    userMetadata {
                        firstName
                    }
                }
            }
        }
    }
`;

const REVIEWS = gql`
    query Reviews($id: ID!) {
        user(id: $id) {
            id
            playedVenues
            isOwn @client
            reviews {
                edges {
                    id
                    rating
                    title
                    content
                    isTestimonial
                    citation
                    createdAt
                    author {
                        picture {
                            path
                        }
                        userMetadata {
                            firstName
                        }
                    }
                }
                pageInfo {
                    totalDocs
                }
            }
        }
    }
`;

const USER_PHOTOS = gql`
    query UserPhotos($id: ID!, $pagination: Pagination) {
        user(id: $id) {
            id
            isOwn @client
            media(pagination: $pagination) {
                edges {
                    id
                    path
                    type
                    orderBy
                    data
                    name
                }
                pageInfo {
                    page
                    nextPage
                    hasNextPage
                    totalDocs
                }
            }
        }
    }
`;

const UPLOAD_FILE = gql`
    mutation UploadFile($file: Upload!) {
        singleUpload(file: $file) {
            id
            path
            type
            orderBy
        }
    }
`;

const ADD_MEDIA = gql`
    mutation UploadMedia($file: Upload!) {
        addMedia(file: $file) {
            id
            path
            type
            orderBy
        }
    }
`;
const UPDATE_FILE = gql`
    mutation UpdateFile($id: ID!, $orderBy: Int, $data: JSON, $name: String) {
        updateFile(id: $id, orderBy: $orderBy, data: $data, name: $name) {
            id
            path
            type
            orderBy
        }
    }
`;

const UPDATE_PHOTOS_ORDER = gql`
    mutation UpdatePhotosOrder($updates: JSON!) {
        updatePhotosOrder(updates: $updates) {
            id
            orderBy
        }
    }
`;

const DELETE_FILE = gql`
    mutation DeleteFile($id: ID!) {
        deleteFile(id: $id)
    }
`;
const DELETE_MEDIA = gql`
    mutation DeleteMedia($id: ID!) {
        deleteMedia(id: $id)
    }
`;

const CONNECT_INSTAGRAM = gql`
    mutation ConnectInstagram($redirectLink: String, $code: String) {
        connectInstagram(redirectLink: $redirectLink, code: $code)
    }
`;

const DISCONNECT_INSTAGRAM = gql`
    mutation DisconnectInstagram {
        disconnectInstagram {
            id
            appMetadata {
                instagramConnected
            }
        }
    }
`;

const MY_EVENTS = gql`
    query MyEvents {
        me {
            id
            events {
                edges {
                    id
                    name
                    hash
                    status
                    location {
                        name
                    }
                    start {
                        formattedDate
                    }
                }
            }
        }
    }
`;

const WRITE_TESTIMONIAL = gql`
    mutation WriteTestimonial($content: String!, $testifier: String!, $title: String!) {
        writeReview(content: $content, isTestimonial: true, citation: $testifier, title: $title) {
            content
        }
    }
`;

const REMOVE_TESTIMONIAL = gql`
    mutation RemoveTestimonial($id: ID!) {
        removeReview(id: $id)
    }
`;

const HIGHLIGHT_REVIEW = gql`
    mutation HighlightReview($id: ID!, $selection: String!) {
        highlightReview(id: $id, selection: $selection) {
            id
            highlightedReview {
                title
                citation
                content
                rating
                author {
                    picture {
                        path
                    }
                    userMetadata {
                        firstName
                    }
                }
            }
        }
    }
`;

const LOG_ACTIVITY = gql`
    mutation LogActivity($subjectId: ID!, $type: String!) {
        logActivity(subjectId: $subjectId, type: $type)
    }
`;

const GIG = gql`
    query GetGig2($id: ID!, $hash: String, $currency: Currency, $locale: String) {
        gig(id: $id, hash: $hash) {
            id
            status
            dj {
                id
            }
            event {
                id
                status
                chosenGig {
                    id
                }
                gigs {
                    id
                    status
                }
                organizer {
                    id
                    picture {
                        path
                    }
                    userMetadata {
                        firstName
                    }
                }
                review {
                    id
                }
            }
            offer {
                canBePaid
                daysUntilPaymentPossible
                totalPayment(currency: $currency) {
                    amount
                    currency
                    formatted(locale: $locale)
                }
                serviceFee(currency: $currency) {
                    amount
                    currency
                    formatted(locale: $locale)
                }
                offer(currency: $currency) {
                    amount
                    currency
                    formatted(locale: $locale)
                }
                cancelationPolicy {
                    days
                    percentage
                }
            }
            dj {
                id
                permalink
                artistName
                displayName @client
                picture {
                    path
                }
                email
                playingLocation {
                    name
                }
                userMetadata {
                    firstName
                    phone
                    bio
                }
            }
            availablePayoutMethods {
                payoutType
                paymentProvider
                ... on Direct {
                    description
                }
            }
        }
    }
`;

const USER_EDITS = gql`
    query UserEdits {
        me {
            id
            appMetadata {
                profileStatus
                approved
            }
            editsMap @client
            edits {
                id
                status
                fieldName
                message
            }
        }
    }
`;

export {
    MY_EVENTS,
    USER,
    REVIEWS,
    WRITE_TESTIMONIAL,
    REMOVE_TESTIMONIAL,
    HIGHLIGHT_REVIEW,
    USER_PHOTOS,
    UPLOAD_FILE,
    DELETE_FILE,
    UPDATE_FILE,
    UPDATE_PHOTOS_ORDER,
    CONNECT_INSTAGRAM,
    DISCONNECT_INSTAGRAM,
    ADD_MEDIA,
    DELETE_MEDIA,
    LOG_ACTIVITY,
    GIG,
    USER_EDITS,
};
