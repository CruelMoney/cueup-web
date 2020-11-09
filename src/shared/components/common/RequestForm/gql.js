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
        $rider: RiderInput
        $date: DateTime
        $startMinute: Int!
        $endMinute: Int!
        $genres: [String!]
        $guestsCount: Int
        $location: Area!
        $timeZone: String
        $djId: ID
        $maxPrice: Int
        $eventType: [String!]
        $isFromPrivateLink: Boolean
    ) {
        createEvent(
            name: $name
            description: $description
            contactEmail: $contactEmail
            contactName: $contactName
            contactPhone: $contactPhone
            rider: $rider
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
            isFromPrivateLink: $isFromPrivateLink
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
