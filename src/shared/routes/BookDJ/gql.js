import { gql } from '@apollo/client';

export const SEARCH = gql`
    query Search($pagination: Pagination!, $filter: SearchFilter!) {
        searchDjs(pagination: $pagination, filter: $filter) {
            edges {
                id
                artistName
                permalink
                genres
                picture {
                    path
                }
                pricing {
                    hourlyRate {
                        amount
                        currency
                        formatted
                    }
                }
                userMetadata {
                    firstName
                    bio
                }
                appMetadata {
                    isPro
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

export const SEARCH_DEEP = gql`
    query Search($pagination: Pagination!, $filter: SearchFilter!) {
        searchDjs(pagination: $pagination, filter: $filter) {
            edges {
                id
                artistName
                permalink
                genres
                pricing {
                    hourlyRate {
                        amount
                        currency
                        formatted
                    }
                }
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
