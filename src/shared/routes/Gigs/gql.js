import { gql } from '@apollo/client';

export const MY_OPPORTUNITIES = gql`
    query Opportunities($pagination: Pagination, $locale: String) {
        opportunities(pagination: $pagination) {
            __typename
            edges {
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
