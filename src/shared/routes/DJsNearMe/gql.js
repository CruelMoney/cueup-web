import { gql } from '@apollo/client';

export const DJS_IN_LOCATION = gql`
    query DjsInLocation($pagination: Pagination!, $filter: SearchFilter!) {
        djsInLocation(pagination: $pagination, filter: $filter) {
            edges {
                id
                artistName
                permalink
                genres
                picture {
                    path
                }
                userMetadata {
                    firstName
                    bio
                }
                appMetadata {
                    isPro
                }
                playingLocations {
                    name
                    latitude
                    longitude
                    radius
                }
                media(pagination: { page: 1, limit: 4, orderBy: ORDER_KEY }) {
                    edges {
                        id
                        path
                        type
                        orderBy
                    }
                    pageInfo {
                        totalDocs
                        hasNextPage
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
