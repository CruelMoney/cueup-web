import React, { useState } from 'react';
import styled from 'styled-components';
import MuteIcon from 'react-ionicons/lib/MdVolumeOff';
import UnmuteIcon from 'react-ionicons/lib/MdVolumeUp';
import { LoadingIndicator } from './Blocks';

const Wrapper = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
`;

const StyledVideo = styled.video`
    position: absolute;
    top: 0;
    left: 0;
    bottom: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 1;
    object-fit: cover;
    pointer-events: none;
`;
const Icon = styled.div`
    position: absolute;
    bottom: 1em;
    right: 1em;
    z-index: 2;
`;

const GracefullVideo = ({ src, muted, canBeUnMuted, ...props }) => {
    const [loaded, setLoaded] = useState(false);
    const [isMuted, setMuted] = useState(muted);

    return (
        <Wrapper
            onClick={() => canBeUnMuted && setMuted((m) => !m)}
            style={{ cursor: canBeUnMuted ? 'pointer' : 'default' }}
        >
            <StyledVideo onCanPlay={() => setLoaded(true)} {...props} muted={isMuted}>
                <source src={src} />
                <p>Video format not supported in your browser</p>
            </StyledVideo>
            {!loaded && <LoadingIndicator />}
            {canBeUnMuted && (
                <Icon>
                    {isMuted ? (
                        <UnmuteIcon color="#fff" fontSize={'2em'} />
                    ) : (
                        <MuteIcon color="#fff" fontSize={'2em'} />
                    )}
                </Icon>
            )}
        </Wrapper>
    );
};

export default GracefullVideo;
