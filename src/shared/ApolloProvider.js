import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { split, ApolloLink } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';

import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from 'apollo-link-ws';
import { useServerContext } from 'components/hooks/useServerContext';
import introspectionQueryResultData from '../../fragmentTypes.json';
import resolvers from './actions/resolvers';
import { authService } from './utils/AuthService';
import customFetch from './utils/uploadProgress';

const APIProvider = ({ children }) => {
    const { environment } = useServerContext();

    const fragmentMatcher = new IntrospectionFragmentMatcher({
        introspectionQueryResultData,
    });

    // custome error handling, only logging errors atm
    const errorLink = onError(({ graphQLErrors, networkError }) => {
        if (graphQLErrors) {
            // do something with graphql error
            graphQLErrors.map(({ message, path }) =>
                console.log(`[GraphQL error]: Message: ${message}, Path: ${path}`)
            );

            for (const err of graphQLErrors) {
                // handle errors differently based on its error code
                switch (err.extensions.code) {
                    case 'UNAUTHENTICATED':
                        break;

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

    const withToken = setContext(async (_, { headers }) => {
        const userToken = authService.getToken();

        return {
            headers: {
                ...headers,
                'x-token': userToken ? `${userToken}` : '',
            },
        };
    });

    const cache = new InMemoryCache({ fragmentMatcher }).restore(window.__APOLLO_STATE__);

    const uploadLink = createUploadLink({
        uri: environment.GQL_DOMAIN,
        credentials: 'include',
        fetch: customFetch,
    });

    const httpLink = ApolloLink.from([errorLink, withToken, uploadLink]);

    const domain = environment.GQL_DOMAIN.split('://').pop();
    const uri = 'ws://' + domain + '/graphql';

    const wsLink = new WebSocketLink({
        uri,
        options: {
            reconnect: true,
        },
    });

    // using the ability to split links, you can send data to each link
    // depending on what kind of operation is being sent
    const link = split(
        // split based on operation type
        ({ query }) => {
            const definition = getMainDefinition(query);
            return (
                definition.kind === 'OperationDefinition' && definition.operation === 'subscription'
            );
        },
        wsLink,
        httpLink
    );

    const client = new ApolloClient({
        cache,
        link,
        connectToDevTools: true,
        resolvers,
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default APIProvider;
