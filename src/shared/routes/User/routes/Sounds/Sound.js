import React, { useState, useRef, useEffect } from 'react';
import styled, { keyframes, css } from 'styled-components';
import { useMeasure } from '@softbind/hook-use-measure';
import { useMutation } from 'react-apollo';
import { Title, BodySmall, SmallBold } from '../../../../components/Text';
import { Row, Pill, SecondaryButton, SmartButton, Col } from '../../../../components/Blocks';
import PlayIcon from '../../../../assets/icons/PlayIcon';
import PauseIcon from '../../../../assets/icons/PauseIcon';
import { SimpleSharing } from '../../../../components/common/Sharing-v2';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';
import Popup from '../../../../components/common/Popup';
import GracefullImage from '../../../../components/GracefullImage';
import soundcloudLogo from '../../../../assets/soundcloud-logo.png';
import useSoundPlayer, { playerStates } from './useSoundPlayer';
import useSamples from './useSamples';
import { DELETE_SOUND, USER_SOUNDS } from './gql';
import AddSound from './AddSound';

const demoSoundSamples = Array.from({ length: 101 }, (_, idx) =>
    Math.max(Math.abs(Math.round(Math.sin(idx / 8) * 100)), 0)
);

const Sound = ({
    title,
    tags,
    duration,
    player,
    samples,
    isOwn,
    loadingRemove,
    deleteSound,
    onEdit,
    small,
    link,
    image,
    demo,
    source,
}) => {
    const isSoundcloud = source === 'soundcloud';

    const [showChildren, setShowChild] = useState(false);

    // Wait until after client-side hydration to show
    useEffect(() => {
        setShowChild(true);
    }, []);

    const {
        scanInSeconds,
        setScanningPosition,
        scanningPosition,
        progressFormatted,
        durationFormatted,
    } = useScanning({
        duration,
        loading: player.loading,
        progress: player.progress,
    });

    const jumpOrStart = () => {
        if (demo) {
            return;
        }
        if (player.state === playerStates.STOPPED) {
            player.play(scanInSeconds);
        } else {
            player.jumpTo(scanInSeconds);
        }
    };

    const togglePlay = () => {
        if (demo) {
            return;
        }
        player.state === playerStates.PLAYING ? player.pause() : player.play();
    };

    return (
        <Container small={small}>
            <Row>
                {!small && image && <AlbumCoverMobile src={image.path} />}
                <Title style={{ marginBottom: '39px' }}>{small ? 'Selected Sound' : title}</Title>
            </Row>
            <Row>
                {!small && image && <AlbumCover src={image.path} />}
                <Col style={{ flex: '1' }}>
                    <Row
                        between
                        style={{
                            marginBottom: small ? '9px' : undefined,
                        }}
                    >
                        <PlayPauseButton state={player.state} onClick={togglePlay} />
                        {small && (
                            <SmallBold demi style={{ marginLeft: '12px', marginTop: '4px' }}>
                                {title}
                            </SmallBold>
                        )}
                        {player.error && (
                            <ErrorMessageApollo
                                style={{ marginLeft: '15px' }}
                                error={player.error}
                            />
                        )}
                        <div style={{ flex: 1 }} />
                        <Genres>
                            {tags.map((g) => (
                                <Pill key={g}>{g}</Pill>
                            ))}
                        </Genres>
                    </Row>
                    {showChildren && (
                        <SoundBars
                            loading={player.loading}
                            progress={player.progress}
                            samples={samples}
                            duration={duration}
                            setScanningPosition={setScanningPosition}
                            small={small}
                            scanningPosition={scanningPosition}
                            jumpOrStart={jumpOrStart}
                        />
                    )}
                    {!small && (
                        <Row between>
                            <BodySmall>{progressFormatted}</BodySmall>
                            <BodySmall>{durationFormatted}</BodySmall>
                        </Row>
                    )}
                </Col>
            </Row>
            {!small && (
                <Row right style={{ marginTop: '15px' }}>
                    <SimpleSharing shareUrl={link} label={null} />
                    {<div style={{ flex: 1 }} />}

                    {isOwn && !isSoundcloud && (
                        <SmartButton loading={loadingRemove} onClick={deleteSound} level="tertiary">
                            Remove
                        </SmartButton>
                    )}
                    {isOwn && !isSoundcloud && (
                        <SecondaryButton onClick={onEdit}>Edit</SecondaryButton>
                    )}
                    {isSoundcloud && <SoundCloudLogo />}
                </Row>
            )}
        </Container>
    );
};

const SoundCloudLogo = styled.div`
    width: 78px;
    height: 12px;
    margin-top: 8px;
    background-color: #98a4b3;
    -webkit-mask-box-image: url(${soundcloudLogo});
`;

export const useScanning = ({ duration, loading, progress = 0 }) => {
    const totalSeconds = duration ? duration.totalSeconds : 0;

    const [scanningPosition, setScanningPosition] = useState(null);

    const scanInSeconds = scanningPosition * totalSeconds;

    const durationFormatted = formatTime(totalSeconds);
    const progressFormatted = loading
        ? 'Loading...'
        : formatTime(scanningPosition ? scanInSeconds : progress);

    return {
        scanInSeconds,
        setScanningPosition,
        scanningPosition,
        progressFormatted,
        durationFormatted,
    };
};

export const SoundBars = ({
    loading,
    progress,
    samples,
    duration,
    setScanningPosition,
    small,
    scanningPosition,
    jumpOrStart,
    style,
}) => {
    if (!samples || samples.length === 0) {
        samples = demoSoundSamples;
    }

    const ref = useRef(null);
    const { bounds } = useMeasure(ref, 'bounds');

    const onScanning = (event) => {
        if (bounds) {
            const { touches } = event;
            let { clientX } = event;
            if (touches) {
                clientX = touches[0].clientX;
            }
            const x = clientX - bounds.left;
            const scan = (x / bounds.width).toFixed(4);
            setScanningPosition(scan);
        }
    };

    const resolution = bounds ? bounds.width / 6 : small ? 75 : 140;

    const bars = useSamples({ resolution, samples });
    const position = progress / duration.totalSeconds;
    const positionIdx = bars.length * position;
    const scanningIdx = bars.length * scanningPosition;
    let activeIdx = positionIdx;
    let halfActiveIdx = scanningIdx;

    if (scanningPosition && scanningIdx < positionIdx) {
        activeIdx = scanningIdx;
        halfActiveIdx = positionIdx;
    }

    return (
        <SoundBarsRow
            ref={ref}
            onMouseMove={onScanning}
            dataLoading={loading || undefined}
            onMouseLeave={() => setScanningPosition(null)}
            onTouchMove={onScanning}
            onTouchCancel={() => setScanningPosition(null)}
            onTouchEnd={jumpOrStart}
            onClick={jumpOrStart}
            small={small}
            style={style}
        >
            {bars.map((p, idx) => (
                <SoundBar
                    hovering={scanningPosition}
                    key={idx}
                    idx={idx}
                    pressure={p}
                    active={idx < activeIdx}
                    halfActive={idx < halfActiveIdx}
                />
            ))}
        </SoundBarsRow>
    );
};

const Container = styled.article`
    margin-bottom: ${({ small }) => (small ? '15px' : '60px')};
    padding-bottom: ${({ small }) => (small ? ' ' : '24px')};
    border-bottom: ${({ small }) => (small ? ' ' : '1px solid #e9ecf0')};
`;

const Genres = styled(Row)`
    justify-self: flex-end;
    flex-wrap: wrap;
    max-height: 45px;
    overflow: hidden;
    justify-content: flex-end;
    > * {
        margin-left: 5px;
        margin-bottom: 5px;
    }
`;

const loadingPulse = keyframes`
  from{
    opacity: 1;
  }
  to{
    opacity: 0.3;
  }
`;

const pulseLoad = ({ dataLoading }) =>
    dataLoading
        ? css`
              animation: ${loadingPulse} 1000ms cubic-bezier(0.445, 0.05, 0.55, 0.95) infinite
                  alternate;
          `
        : null;

const SoundBarStyle = styled.span.attrs(({ pressure, active, halfActive, hovering }) => ({
    style: {
        height: `${pressure}%`,
        background: active ? '#50e3c2' : halfActive ? '#50e3c299' : '#E9ECF0',
        transition: hovering ? 'none' : 'all 1000ms ease',
    },
}))`
    flex: 1;
    margin: 1px;
    border-radius: 10px;
    min-height: 4px;
    pointer-events: none;
`;

const SoundBar = (props) => {
    return <SoundBarStyle {...props} />;
};

const SoundBarsRow = styled(Row)`
    height: ${({ small }) => (small ? '50px' : '100px')};
    align-items: center;
    cursor: pointer;
    touch-action: none;
    ${pulseLoad}
`;

const StyledStateButton = styled.button`
    display: flex;
    height: 36px;
    width: 36px;
    min-width: 36px;
    justify-content: center;
    align-items: center;
    border: 1px solid #50e3c2 !important;
    border-radius: 18px;
    svg {
        fill: #50e3c2;
        stroke: #50e3c2;
    }
    :hover {
        background: #50e3c2;
        svg {
            fill: #fff;
            stroke: #fff;
        }
    }
`;
const PlayPauseButton = ({ state, ...props }) => {
    return (
        <StyledStateButton {...props}>
            {state !== playerStates.PLAYING ? <PlayIcon /> : <PauseIcon />}
        </StyledStateButton>
    );
};

const formatTime = (seconds) =>
    new Date(null, null, null, null, null, seconds)
        .toTimeString()
        .split(' ')[0]
        .replace('00:', '')
        .replace(':', '.');

const Wrapper = (props) => {
    const { id, file, duration, userId, isOwn, title, description, tags } = props;
    const player = useSoundPlayer({
        src: file.path,
        duration: duration.totalSeconds,
        track: props,
    });
    const [showPopup, setShowPopup] = useState(false);

    const [deleteSound, { loading: loadingRemove }] = useMutation(DELETE_SOUND, {
        variables: { id },
        refetchQueries: [{ query: USER_SOUNDS, variables: { userId } }],
        awaitRefetchQueries: true,
    });
    return (
        <>
            <Sound
                {...props}
                deleteSound={deleteSound}
                loadingRemove={loadingRemove}
                player={player}
                onEdit={() => setShowPopup(true)}
            />
            {isOwn && (
                <Popup
                    showing={showPopup}
                    onClickOutside={() => setShowPopup(false)}
                    width={'750px'}
                >
                    <AddSound
                        userId={userId}
                        sound={props}
                        initialData={{
                            id,
                            title,
                            description,
                            tags,
                        }}
                        onCancel={() => setShowPopup(false)}
                        closeModal={() => setShowPopup(false)}
                    />
                </Popup>
            )}
        </>
    );
};

const AlbumCover = styled(GracefullImage)`
    border-radius: 3px;
    width: 160px;
    min-width: 160px;
    height: 160px;
    margin-right: 15px;
    object-fit: cover;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.3);
    @media only screen and (max-width: 768px) {
        display: none;
    }
`;

const AlbumCoverMobile = styled(AlbumCover)`
    width: 50px;
    min-width: 50px;
    height: 50px;
    display: none;
    border-radius: 1px;
    @media only screen and (max-width: 768px) {
        display: block;
    }
`;

export default Wrapper;
