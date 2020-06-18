import React from 'react';
import useConnectSoundCloud from 'components/hooks/useConnectSoundcloud';
import { SmartButton } from '../../../components/Blocks';

const ConnectSoundCloud = ({ soundCloudConnected, userId }) => {
    const [connect, { loading, disconnect }] = useConnectSoundCloud({
        soundCloudConnected,
        userId,
    });

    return (
        <SmartButton
            level="input"
            onClick={() => (soundCloudConnected ? disconnect() : connect())}
            loading={loading}
            warning={soundCloudConnected ? 'Are you sure?' : false}
            style={{
                background: soundCloudConnected
                    ? undefined
                    : 'linear-gradient(0deg, #f83b01, #f57a0f)',
                minWidth: '250px',
                color: soundCloudConnected ? undefined : '#fff',
                fontWeight: soundCloudConnected ? 400 : 500,
            }}
        >
            {soundCloudConnected ? 'Disconnect SoundCloud' : 'Connect SoundCloud'}
        </SmartButton>
    );
};

export default ConnectSoundCloud;
