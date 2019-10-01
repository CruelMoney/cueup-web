import React, { useEffect, useState } from 'react';
import { useConnectInstagram } from '../utils/Hooks';
import Notification from './common/Notification';
import ErrorMessageApollo from './common/ErrorMessageApollo';

const InstagramConnect = () => {
    const [state, setState] = useState({});
    const [connect, { loading, error, data }] = useConnectInstagram();

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const code = parsedUrl.searchParams.get('code');
        const isInstagramConnect = parsedUrl.searchParams.get('instagramConnect');

        setState({ isInstagramConnect, code });
    }, []);

    const { code } = state;

    if (!code) {
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
            message={data ? 'Instagram connected' : 'Connecting instagram'}
        >
            {error && <ErrorMessageApollo error={error} />}
        </Notification>
    );
};

export default InstagramConnect;
