import { gql } from '@apollo/client';

const NAME_GENERATED = gql`
    mutation NameGenerated($name: String) {
        nameGenerated(name: $name)
    }
`;

const COUNT_UPDATED_SUB = gql`
    subscription CountUpdated {
        countUpdated
    }
`;

const GET_GENERATED_NAMES_COUNT = gql`
    query GetGeneratedNamesCount {
        getGeneratedNamesCount
    }
`;

const SLIM_SIGNUP = gql`
    mutation CreateUser($email: EmailAddress!, $password: String!, $redirectLink: String!) {
        signUpToken(email: $email, password: $password, redirectLink: $redirectLink) {
            token
        }
    }
`;

export { NAME_GENERATED, COUNT_UPDATED_SUB, GET_GENERATED_NAMES_COUNT, SLIM_SIGNUP };
