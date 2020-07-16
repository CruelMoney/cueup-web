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
