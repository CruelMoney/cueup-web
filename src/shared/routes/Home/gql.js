import { gql } from '@apollo/client';

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
            appMetadata {
                isPro
            }
        }
    }
`;

export { FEATURED_DJS };
