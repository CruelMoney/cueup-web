import { gql } from '@apollo/client';

const CHECK_DJ_AVAILABILITY = gql`
    mutation DjsAvailable($location: Area!, $date: DateTime) {
        djsAvailable(location: $location, date: $date)
    }
`;

const CREATE_EVENT = gql`
    mutation CreateEvent(
        $name: String!
        $description: String!
        $contactEmail: String!
        $contactName: String!
        $contactPhone: String
        $speakers: Boolean
        $lights: Boolean
        $date: DateTime!
        $startMinute: Int!
        $endMinute: Int!
        $genres: [String!]
        $guestsCount: Int
        $location: Area!
        $timeZone: String
        $djId: ID
        $maxPrice: Int
        $eventType: [String!]
    ) {
        createEvent(
            name: $name
            description: $description
            contactEmail: $contactEmail
            contactName: $contactName
            contactPhone: $contactPhone
            speakers: $speakers
            lights: $lights
            startMinute: $startMinute
            endMinute: $endMinute
            date: $date
            timeZone: $timeZone
            genres: $genres
            guestsCount: $guestsCount
            location: $location
            djId: $djId
            maxPrice: $maxPrice
            eventType: $eventType
        ) {
            id
            hash
            organizer {
                id
            }
        }
    }
`;

export { CHECK_DJ_AVAILABILITY, CREATE_EVENT };
