import React from 'react';
import useConnectMixcloud from 'components/hooks/useConnectMixcloud';
import { SmartButton } from '../../../components/Blocks';

const ConnectMixcloudButton = ({ mixcloudConnected, userId }) => {
    const [connect, { loading, disconnect }] = useConnectMixcloud({
        mixcloudConnected,
        userId,
    });

    return (
        <SmartButton
            level="input"
            onClick={() => (mixcloudConnected ? disconnect() : connect())}
            loading={loading}
            warning={mixcloudConnected ? 'Are you sure?' : false}
            style={{
                background: mixcloudConnected
                    ? undefined
                    : 'linear-gradient(0deg, rgb(80, 0, 255), #4fa6d3)',
                minWidth: '250px',
                color: mixcloudConnected ? undefined : '#fff',
                fontWeight: mixcloudConnected ? 400 : 500,
            }}
        >
            {mixcloudConnected ? 'Disconnect Mixcloud' : 'Connect Mixcloud'}
        </SmartButton>
    );
};

export default ConnectMixcloudButton;
