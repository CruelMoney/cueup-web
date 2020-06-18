import { useCallback, useEffect, useState } from 'react';
import gql from 'graphql-tag';
import { useMutation } from 'react-apollo';
import { USER_SOUNDS } from 'routes/User/routes/Sounds/gql';
import { ME } from '../gql';

const CONNECT_MIXCLOUD = gql`
    mutation ConnectMixcloud($code: String, $redirectUrl: String) {
        connectMixcloud(code: $code, redirectUrl: $redirectUrl)
    }
`;
const DISCONNECT_MIXCLOUD = gql`
    mutation DisconnectMixcloud {
        disconnectMixcloud
    }
`;

const getRedirectUrl = () => {
    return (
        window.location.origin + window.location.pathname + '?connectMixcloud=true&modal=addSound'
    );
};

const useConnectMixcloud = ({ mixcloudConnected, userId }) => {
    const [connected, setConencted] = useState(mixcloudConnected);

    const [connect, { loading, ...rest }] = useMutation(CONNECT_MIXCLOUD, {
        update: (proxy, { data: { connectMixcloud } }) => {
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
                            mixcloudConnected: true,
                        },
                    },
                },
            });
        },
    });

    const [disconnect, { loading: disconnectLoading }] = useMutation(DISCONNECT_MIXCLOUD, {
        update: (proxy, { data: { disconnectMixcloud } }) => {
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
                            mixcloudConnected: false,
                        },
                    },
                },
            });
        },
    });

    const doConnect = useCallback(
        async (args) => {
            const { variables } = args || {};
            const redirectUrl = getRedirectUrl();
            // redirect to mixcloud auth screen
            if (!variables || !variables.code) {
                const { data } = await connect({
                    variables: { redirectUrl },
                });
                window.open(data.connectMixcloud);
            }
        },
        [connect]
    );

    useEffect(() => {
        if (!connected) {
            const parsedUrl = new URL(window.location.href);
            const code = parsedUrl.searchParams.get('code');
            const connectMixcloud = parsedUrl.searchParams.get('connectMixcloud');
            if (code && connectMixcloud) {
                const redirectUrl = getRedirectUrl();
                window.history.replaceState({}, document.title, window.location.pathname);
                connect({
                    variables: { code, redirectUrl },
                });
                setConencted(true);
            }
        }
    }, [connect, connected]);

    return [doConnect, { loading: loading || disconnectLoading, disconnect, ...rest }];
};

export default useConnectMixcloud;
