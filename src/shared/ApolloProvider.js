import React from 'react';
import { ApolloProvider } from 'react-apollo';
import { ApolloClient } from 'apollo-client';
import { InMemoryCache, IntrospectionFragmentMatcher } from 'apollo-cache-inmemory';
import { onError } from 'apollo-link-error';
import { ApolloLink } from 'apollo-link';
import { setContext } from 'apollo-link-context';
import { createUploadLink } from 'apollo-upload-client';
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

    const link = ApolloLink.from([errorLink, withToken, uploadLink]);

    const client = new ApolloClient({
        cache,
        link,
        connectToDevTools: true,
        resolvers,
    });

    return <ApolloProvider client={client}>{children}</ApolloProvider>;
};

export default APIProvider;
