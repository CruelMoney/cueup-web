import React, { useEffect, useState } from 'react';
import Notification from './common/Notification';
import ErrorMessageApollo from './common/ErrorMessageApollo';
import { useConnectInstagram } from './hooks/useConnectInstagram';

const InstagramConnect = () => {
    const [state, setState] = useState({});
    const [connect, { loading, error, data }] = useConnectInstagram();

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const code = parsedUrl.searchParams.get('code');

        const isInstagramConnect = parsedUrl.pathname.includes('connectInstagram');

        setState({ isInstagramConnect, code });
    }, []);

    const { code, isInstagramConnect } = state;

    if (!code || !isInstagramConnect) {
        return null;
    }

    return (
        <InstagramConnectIndicator
            code={code}
            mutate={connect}
            loading={loading}
            error={error}
            data={data}
        />
    );
};

const InstagramConnectIndicator = ({ code, mutate, loading, data, error }) => {
    const [active, setActive] = useState(true);

    useEffect(() => {
        const connect = async () => {
            await mutate({
                variables: {
                    code,
                },
            });
        };
        connect();
    }, [code, mutate]);

    useEffect(() => {
        if (loading === false) {
            // TODO should remove params here
            const r = setTimeout((_) => setActive(false), 3000);
            return (_) => clearTimeout(r);
        }
    }, [loading]);

    return (
        <Notification
            overlay
            active={active}
            loading={loading}
            message={data ? data.connectInstagram : 'Connecting instagram'}
        >
            {error && <ErrorMessageApollo error={error} />}
        </Notification>
    );
};

export default InstagramConnect;
