import { ApolloLink } from 'apollo-link';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import fetch from 'node-fetch';
import resolvers from '../../shared/actions/resolvers';
import introspectionQueryResultData from '../../../fragmentTypes.json';

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
});

const addApollo = (_req, res, next) => {
    const headers = {
        origin: process.env.WEBSITE_URL,
    };

    const xToken = _req.cookies['x-token'];

    if (xToken) {
        headers['x-token'] = xToken; // forward token
    }

    const httpLink = createHttpLink({
        fetch: fetch,
        uri: process.env.REACT_APP_CUEUP_GQL_DOMAIN,
        credentials: 'include',
        headers,
    });

    const link = ApolloLink.from([errorLink, httpLink]);

    const apolloClient = new ApolloClient({
        ssrMode: true,
        link,
        cache: new InMemoryCache({ fragmentMatcher }),
        resolvers,
    });

    res.locals.apolloClient = apolloClient;

    next();
};

// Ignore errors
const errorLink = onError(({ graphQLErrors, networkError, response, operation, forward }) => {
    console.log({ graphQLErrors });
    return forward(operation);
});

export default addApollo;
