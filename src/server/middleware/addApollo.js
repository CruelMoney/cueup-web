import { ApolloClient, InMemoryCache, ApolloLink, createHttpLink } from '@apollo/client';
import { onError } from '@apollo/client/link/error';
import fetch from 'node-fetch';
import resolvers from '../../shared/actions/resolvers';

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

    // Ignore errors
    const errorLink = onError(({ graphQLErrors, operation, forward }) => {
        console.log({ graphQLErrors });
        return forward(operation);
    });

    const link = ApolloLink.from([errorLink, httpLink]);

    const apolloClient = new ApolloClient({
        ssrMode: true,
        link,
        cache: new InMemoryCache({
            possibleTypes: {
                PayoutMethod: ['Bank', 'Direct'],
                PaymentIntent: [
                    'DirectPaymentIntent',
                    'StripePaymentIntent',
                    'XenditPaymentIntent',
                ],
            },
        }),
        resolvers,
    });

    res.locals.apolloClient = apolloClient;

    next();
};

export default addApollo;
