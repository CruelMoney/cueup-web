import gql from 'graphql-tag';

const FEATURED_DJS = gql`
    query FeaturedDjs {
        featuredDjs {
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
