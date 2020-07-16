import gql from 'graphql-tag';

export const MY_LOCATIONS = gql`
    query Me {
        me {
            id
            playingLocations {
                id
                name
                radius
                longitude
                latitude
                fromDate
                toDate
            }
        }
    }
`;

export const ADD_LOCATION = gql`
    mutation AddLocation($location: Area!, $fromDate: DateTime, $toDate: DateTime) {
        addPlayingLocation(location: $location, fromDate: $fromDate, toDate: $toDate) {
            id
            name
            radius
            longitude
            latitude
            fromDate
            toDate
        }
    }
`;

export const UPDATE_LOCATION = gql`
    mutation UpdateLocation($id: ID!, $location: Area, $fromDate: DateTime, $toDate: DateTime) {
        updatePlayingLocation(id: $id, location: $location, fromDate: $fromDate, toDate: $toDate) {
            id
            name
            radius
            longitude
            latitude
            fromDate
            toDate
        }
    }
`;

export const REMOVE_LOCATION = gql`
    mutation RemoveLocation($id: ID!) {
        removePlayingLocation(id: $id)
    }
`;
