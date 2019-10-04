import React, { Component } from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { Environment } from '../shared/constants/constants';
import { authService } from '../shared/utils/AuthService';
import introspectionQueryResultData from '../shared/fragmentTypes.json';
import customFetch from '../shared/utils/uploadProgress';

import StateResolvers, { defaultAppState } from '../shared/localState/resolvers';
import typeDefs from '../shared/localState/typeDefs';

const fragmentMatcher = new IntrospectionFragmentMatcher({
    introspectionQueryResultData,
});

// custome error handling, only logging errors atm
const errorLink = onError(({ graphQLErrors, networkError, operation, forward, response }) => {
    if (graphQLErrors) {
        // do something with graphql error
        graphQLErrors.map(({ message, path }) =>
            console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
        );

        let headers = {};
        for (const err of graphQLErrors) {
            // handle errors differently based on its error code
            switch (err?.extensions?.code) {
                case 'UNAUTHENTICATED':
                    // old token might have expired, lets remove it and try again
                    authService.logout();
                    headers = operation.getContext().headers;
                    operation.setContext({
                        headers: {
                            ...headers,
                            'x-token': null,
                        },
                    });
                    return forward(operation);

                // handle other errors
                default:
                    break;
            }
        }
    }

    if (networkError) {
        // do something with network error
        console.warn({ networkError });
    }
});

let token;
const withToken = setContext(async (_, { headers }) => {
    // get token if not present
    if (!token) {
        try {
            const userToken = authService.getToken();
            token = userToken;
        } catch (error) {
            console.warn(error);
        }
    }
    return {
        headers: {
            ...headers,
            'x-token': token ? `${token}` : '',
        },
    };
});

const resetToken = onError(({ networkError }) => {
    if (networkError && networkError.name === 'ServerError' && networkError.statusCode === 401) {
        // remove cached token on 401 from the server
        token = null;
    }
});

const authFlowLink = withToken.concat(resetToken);

const cache = new InMemoryCache({ fragmentMatcher }).restore(window.__APOLLO_STATE__);

const uploadLink = createUploadLink({
    uri: Environment.GQL_DOMAIN,
    credentials: 'include',
    fetch: customFetch,
});

const link = ApolloLink.from([errorLink, authFlowLink, uploadLink]);

const reset = async () => {
    token = null;
    authService.logout();
    await client.resetStore();
};

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

const client = new ApolloClient({
    cache,
    link,
    connectToDevTools: true,
    resolvers: StateResolvers(getState, writeState),
    typeDefs,
});

class APIProvider extends Component {
    constructor(props) {
        super(props);
        this.state = { isHydratingStore: false };
    }

    render() {
        return <ApolloProvider client={client}>{this.props.children}</ApolloProvider>;
    }
}

export default APIProvider;

export { reset };
