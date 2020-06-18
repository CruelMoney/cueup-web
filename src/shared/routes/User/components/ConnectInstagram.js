import React from 'react';
import { useConnectInstagram } from 'components/hooks/useConnectInstagram';
import { SmartButton } from '../../../components/Blocks';

const ConnectInstagram = ({ instagramConnected, style }) => {
    const [connect, { loading, disconnect }] = useConnectInstagram();

    return (
        <SmartButton
            level="input"
            onClick={() => (instagramConnected ? disconnect() : connect())}
            loading={loading}
            warning={instagramConnected ? 'Are you sure?' : false}
            style={{
                background: instagramConnected
                    ? undefined
                    : 'linear-gradient(180deg,  #e1306c, #c13584)',
                minWidth: '250px',
                color: instagramConnected ? undefined : '#fff',
                fontWeight: instagramConnected ? 400 : 500,
                ...style,
            }}
        >
            {instagramConnected ? 'Disconnect Instagram' : 'Connect Instagram'}
        </SmartButton>
    );
};

export default ConnectInstagram;
