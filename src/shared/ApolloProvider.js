import React from 'react';
import { ApolloClient, ApolloProvider, InMemoryCache, ApolloLink, split } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';

import { setContext } from '@apollo/client/link/context';
import { createUploadLink } from 'apollo-upload-client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { useServerContext } from 'components/hooks/useServerContext';
import resolvers from './actions/resolvers';
import { authService } from './utils/AuthService';
import customFetch from './utils/uploadProgress';

const APIProvider = ({ children }) => {
    const { environment } = useServerContext();

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
                        console.log('unauthenticated - removing token');
                        authService.removeToken();
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

    const cache = new InMemoryCache({
        possibleTypes: {
            PayoutMethod: ['Bank', 'Direct'],
            PaymentIntent: ['DirectPaymentIntent', 'StripePaymentIntent', 'XenditPaymentIntent'],
        },
        typePolicies: {
            User: {
                fields: {
                    appMetadata: {
                        merge: true,
                    },
                    userMetadata: {
                        merge: true,
                    },
                    userSettings: {
                        merge: true,
                    },
                },
            },
        },
    }).restore(window.__APOLLO_STATE__);

    const uploadLink = createUploadLink({
        uri: environment.GQL_DOMAIN,
        credentials: 'include',
        fetch: customFetch,
    });

    const httpLink = ApolloLink.from([errorLink, withToken, uploadLink]);
    let link = httpLink;

    const supportsWebSockets = 'WebSocket' in window || 'MozWebSocket' in window;
    if (supportsWebSockets) {
        const protocol = process.env.NODE_ENV === 'development' ? 'ws://' : 'wss://';
        const domain = environment.GQL_DOMAIN.split('://').pop();
        const uri = protocol + domain + '/graphql';

        const wsLink = new WebSocketLink({
            uri,
            options: {
                reconnect: true,
            },
        });
        // using the ability to split links, you can send data to each link
        // depending on what kind of operation is being sent
        link = split(
            // split based on operation type
            ({ query }) => {
                const definition = getMainDefinition(query);
                return (
                    definition.kind === 'OperationDefinition' &&
                    definition.operation === 'subscription'
                );
            },
            wsLink,
            httpLink
        );
    }

    const client = new ApolloClient({
        cache,
        link,
        resolvers,
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default APIProvider;
