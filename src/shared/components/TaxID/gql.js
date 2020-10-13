import { gql } from '@apollo/client';

export const USER_TAX_ID = gql`
    query UserEdits {
        me {
            id
            userMetadata {
                taxId {
                    value
                    type
                    country
                    verification
                }
            }
        }
    }
`;
