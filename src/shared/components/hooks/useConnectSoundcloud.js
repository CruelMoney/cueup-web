import React, { useCallback, useEffect, useState } from 'react';
import { gql, useMutation } from '@apollo/client';

import { USER_SOUNDS } from 'routes/User/routes/Sounds/gql';
import { SmartButton } from '../Blocks';
import { ME } from '../gql';

const CONNECT_SOUNDCLOUD = gql`
    mutation ConnectSoundCloud($code: String, $redirectUrl: String) {
        connectSoundCloud(code: $code, redirectUrl: $redirectUrl)
    }
`;
const DISCONNECT_SOUNDCLOUD = gql`
    mutation DisconnectSoundCloud {
        disconnectSoundCloud
    }
`;

const useConnectSoundCloud = ({ soundCloudConnected, userId }) => {
    const [connected, setConencted] = useState(soundCloudConnected);

    const [connect, { loading, ...rest }] = useMutation(CONNECT_SOUNDCLOUD, {
        refetchQueries: [
            {
                query: USER_SOUNDS,
                variables: {
                    userId,
                },
            },
            {
                query: ME,
            },
        ],
        awaitRefetchQueries: true,
    });

    const [disconnect, { loading: disconnectLoading }] = useMutation(DISCONNECT_SOUNDCLOUD, {
        refetchQueries: [
            {
                query: USER_SOUNDS,
                variables: {
                    userId,
                },
            },
            {
                query: ME,
            },
        ],
        awaitRefetchQueries: true,
    });

    const doConnect = useCallback(
        async (args) => {
            const { variables } = args || {};
            const redirectUrl = window.location.href;
            // redirect to insta auth screen
            if (!variables || !variables.code) {
                const { data } = await connect({
                    variables: { redirectUrl },
                });
                window.open(data.connectSoundCloud);
            }
        },
        [connect]
    );

    useEffect(() => {
        if (!connected) {
            const parsedUrl = new URL(window.location.href);
            const code = parsedUrl.searchParams.get('soundcloudCode');
            if (code) {
                window.history.replaceState({}, document.title, window.location.pathname);
                connect({
                    variables: { code },
                });
                setConencted(true);
            }
        }
    }, [connect, connected]);

    return [doConnect, { loading: loading || disconnectLoading, disconnect, ...rest }];
};

export default useConnectSoundCloud;
