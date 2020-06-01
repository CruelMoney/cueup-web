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
        >
            {mixcloudConnected ? 'Disconnect Mixcloud' : 'Connect Mixcloud'}
        </SmartButton>
    );
};

export default ConnectMixcloudButton;
