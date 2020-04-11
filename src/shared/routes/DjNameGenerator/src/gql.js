import gql from 'graphql-tag';

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

export { NAME_GENERATED, COUNT_UPDATED_SUB, GET_GENERATED_NAMES_COUNT };
