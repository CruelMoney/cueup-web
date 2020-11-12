import { gql } from '@apollo/client';

export const MY_OPPORTUNITIES = gql`
    query Opportunities($pagination: Pagination, $locale: String) {
        opportunities(pagination: $pagination) {
            __typename
            edges {
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
                gig {
                    id
                    status
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

export const UNDO_DECLINE = gql`
    mutation undoDeclineGig($id: ID!) {
        undoDeclineGig(gigId: $id) {
            id
            statusHumanized
            status
            isActionable
        }
    }
`;

export const PASS_OPPORTUNITY = gql`
    mutation passOpportunity($id: ID!) {
        passOpportunity(eventId: $id) {
            id
            statusHumanized
            status
            isActionable
        }
    }
`;

export const UNDO_PASS = gql`
    mutation undoPassOpportunity($id: ID!) {
        undoPassOpportunity(eventId: $id) {
            id
            statusHumanized
            status
            isActionable
        }
    }
`;
