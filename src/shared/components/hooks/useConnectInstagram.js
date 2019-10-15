import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { CONNECT_INSTAGRAM, DISCONNECT_INSTAGRAM } from '../../routes/User/gql';
import { Environment } from '../../constants/constants';
import { ME } from '../gql';

export const useConnectInstagram = () => {
    const [mutate, { loading, ...rest }] = useMutation(CONNECT_INSTAGRAM, {
        update: (proxy, { data: { connectInstagram } }) => {
            const { me } = proxy.readQuery({
                query: ME,
            });

            proxy.writeQuery({
                query: ME,
                data: {
                    me: {
                        ...me,
                        appMetadata: {
                            ...me.appMetadata,
                            instagramConnected: true,
                        },
                    },
                },
            });
        },
    });

    const [disconnect, { loading: disconnectLoading }] = useMutation(DISCONNECT_INSTAGRAM);

    const connect = useCallback(
        async (args) => {
            const { variables, ...options } = args || {};
            const redirectLink = Environment.CALLBACK_DOMAIN;
            // redirect to insta auth screen
            if (!variables || !variables.code) {
                window.open(
                    Environment.GQL_DOMAIN + '/connectInstagram?redirectLink=' + redirectLink,
                    '_blank'
                );
            } else {
                // already have the code, lets connect
                await mutate({
                    variables: {
                        redirectLink,
                        ...variables,
                    },
                    ...options,
                });
            }
        },
        [mutate]
    );

    return [connect, { loading: loading || disconnectLoading, disconnect, ...rest }];
};
