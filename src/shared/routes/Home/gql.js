import gql from 'graphql-tag';

const FEATURED_DJS = gql`
    query FeaturedDjs($countryCode: String) {
        featuredDjs(countryCode: $countryCode) {
            id
            artistName
            permalink
            genres
            picture {
                path
            }
            playingLocations {
                name
            }
            userMetadata {
                firstName
            }
        }
    }
`;

export { FEATURED_DJS };
