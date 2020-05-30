import gql from 'graphql-tag';

const USER_SOUNDS = gql`
    query UserSounds($userId: ID!, $pagination: Pagination) {
        userSounds(userId: $userId, pagination: $pagination) {
            edges {
                id
                title
                description
                date
                samples
                tags
                source
                duration {
                    totalSeconds
                }
                file {
                    id
                    path
                }
                image {
                    id
                    path
                }
            }
            pageInfo {
                page
                nextPage
                hasNextPage
                totalDocs
            }
        }
    }
`;

const UPDATE_SOUND = gql`
    mutation UpdateSound(
        $id: ID!
        $title: String
        $date: DateTime
        $description: String
        $tags: [String!]
        $file: ID
        $image: ID
    ) {
        updateSound(
            id: $id
            title: $title
            date: $date
            description: $description
            tags: $tags
            file: $file
            imageId: $image
        ) {
            id
            title
            description
            date
            samples
            tags
            duration {
                totalSeconds
            }
            file {
                id
                path
            }
            image {
                id
                path
            }
        }
    }
`;

const ADD_SOUND = gql`
    mutation AddSound(
        $title: String!
        $description: String
        $date: DateTime
        $tags: [String!]
        $file: ID!
        $image: ID
        $addToSoundCloud: Boolean
        $addToMixcloud: Boolean
    ) {
        addSound(
            title: $title
            description: $description
            tags: $tags
            date: $date
            file: $file
            imageId: $image
            addToSoundCloud: $addToSoundCloud
            addToMixcloud: $addToMixcloud
        ) {
            id
            title
            date
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
            image {
                id
                path
            }
        }
    }
`;

const DELETE_SOUND = gql`
    mutation DeleteSound($id: ID!) {
        removeSound(id: $id)
    }
`;

export { USER_SOUNDS, UPDATE_SOUND, ADD_SOUND, DELETE_SOUND };
