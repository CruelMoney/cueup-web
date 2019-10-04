import { ApolloLink } from 'apollo-link';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { onError } from 'apollo-link-error';
import fetch from 'node-fetch';
import StateResolvers, { defaultAppState } from 'localState/resolvers';

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
    const cache = new InMemoryCache();

    // Helper function to get data from the cache
    const getState = (query) => {
        return cache.readQuery({ query }).state;
    };

    // Helper function to write data back to the cache
    const writeState = (state) => {
        return cache.writeData({ data: { state } });
    };

    // initial apollo local state
    const initState = () => {
        const state = {
            appState: defaultAppState,
            __typename: 'State',
        };

        writeState(state);
    };
    initState();

    const apolloClient = new ApolloClient({
        ssrMode: true,
        link,
        cache,
        resolvers: StateResolvers(getState, writeState),
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
