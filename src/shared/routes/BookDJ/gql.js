import gql from 'graphql-tag';

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
                userMetadata {
                    firstName
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
