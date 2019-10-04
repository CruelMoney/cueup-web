import gql from 'graphql-tag';

const typeDefs = gql`
    type appState {
        language: String
    }
`;

export default typeDefs;
