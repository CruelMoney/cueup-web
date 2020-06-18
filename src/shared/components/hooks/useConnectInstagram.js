import { useCallback } from 'react';
import { useMutation } from 'react-apollo';
import { CONNECT_INSTAGRAM, DISCONNECT_INSTAGRAM } from '../../routes/User/gql';
import { ME } from '../gql';
import { useServerContext } from './useServerContext';

export const useConnectInstagram = () => {
    const { environment } = useServerContext();

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
            const redirectLink = environment.CALLBACK_DOMAIN + '/connectInstagram';
            // redirect to insta auth screen
            if (!variables || !variables.code) {
                window.open(
                    environment.GQL_DOMAIN + '/connectInstagram?redirectLink=' + redirectLink,
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
