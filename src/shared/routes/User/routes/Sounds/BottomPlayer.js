import React from 'react';
import styled from 'styled-components';
import { useTransition, animated } from 'react-spring';
import { Container, Row, Col, ReadMoreText, HideBelow } from '../../../../components/Blocks';
import PlayIcon from '../../../../assets/icons/PlayIcon';
import PauseIcon from '../../../../assets/icons/PauseIcon';
import { BodySmall, SmallBold } from '../../../../components/Text';
import useSoundPlayer, { useCurrentDeck, playerStates } from './useSoundPlayer';
import useScanning from './useScanning';
import SoundBars from './SoundBars';

const BottomPlayer = ({ track, next, previous }) => {
    const { progress, state, jumpTo, pause, play } = useSoundPlayer({
        track: track,
        src: track ? (track.file ? track.file.path : '') : '',
        duration: track ? (track.duration ? track.duration.totalSeconds : 0) : 0,
    });

    const togglePlay = () => {
        if (state === playerStates.PLAYING) {
            pause();
        } else {
            play();
        }
    };

    if (!track) {
        return null;
    }

    return (
        <PlayerRow middle center>
            <PlayerSpacing>
                <Row middle center>
                    <PlayPauseButton
                        state={state}
                        onClick={togglePlay}
                        next={next}
                        previous={previous}
                    />
                </Row>
            </PlayerSpacing>
            <RightRow middle center>
                {track && <TrackInfo track={track} />}
                <HideBelow width={420} style={{ flex: 4 }}>
                    {
                        <PlayerProgress
                            state={state}
                            progress={progress}
                            track={track}
                            jumpTo={jumpTo}
                            play={play}
                        />
                    }
                </HideBelow>
            </RightRow>
        </PlayerRow>
    );
};

const PlayerRow = styled(Row)`
    @media only screen and (max-width: 420px) {
        flex-direction: row-reverse;
    }
`;

const PlayerProgress = ({ progress, state, track, jumpTo, play }) => {
    const {
        scanInSeconds,
        setScanningPosition,
        scanningPosition,
        progressFormatted,
        durationFormatted,
    } = useScanning({
        progress,
        duration: track ? track.duration : null,
    });

    const jumpOrStart = () => {
        if (state === playerStates.PLAYING) {
            jumpTo(scanInSeconds);
        } else {
            play();
        }
    };

    return (
        <Row center middle>
            <ReadMoreText>{progressFormatted}</ReadMoreText>
            <SoundBars
                progress={progress}
                samples={track ? track.samples : []}
                duration={track ? track.duration : 0}
                setScanningPosition={setScanningPosition}
                scanningPosition={scanningPosition}
                jumpOrStart={jumpOrStart}
                style={{ height: '40px', flex: 1, margin: '0 9px' }}
            />
            <ReadMoreText>{durationFormatted}</ReadMoreText>
        </Row>
    );
};

const TrackInfo = ({ track: { title, artistName, image } }) => {
    return (
        <Row middle style={{ flex: 1, paddingRight: '15px' }}>
            {image && <AlbumCover src={image.path} />}
            <Col>
                <SmallBold demi style={{ fontSize: '15px', margin: 0 }}>
                    {title}
                </SmallBold>
                <BodySmall style={{ margin: 0, fontSize: '12px', lineHeight: '15px' }}>
                    {artistName}
                </BodySmall>
            </Col>
        </Row>
    );
};

const AlbumCover = styled.img`
    margin-right: 9px;
    object-fit: cover;
    width: 40px;
    min-width: 40px;
    height: 40px;
    border-radius: 2px;
`;

const StyledStateButton = styled.button`
    display: flex;
    height: 42px;
    width: 42px;
    min-width: 42px;
    justify-content: center;
    align-items: center;
    border-radius: 18px;
    svg {
        fill: rgb(77, 100, 128);
        stroke: rgb(77, 100, 128);
        transform: scale(1.5);
    }
    :hover {
        svg {
            fill: #122b48;
            stroke: #122b48;
        }
    }
`;

const PlayPauseButton = ({ state, onClick, previous, next }) => {
    return (
        <>
            <SkipButton style={{ transform: 'rotate(180deg)' }} onClick={previous} />
            <StyledStateButton onClick={onClick}>
                {state === playerStates.PLAYING ? <PauseIcon /> : <PlayIcon />}
            </StyledStateButton>
            <SkipButton onClick={next} />
        </>
    );
};

const StyledSkipButton = styled(StyledStateButton)`
    height: 36px;
    width: 36px;
    min-width: 36px;
    svg {
        margin: 0;
        transform: none;
    }
`;

const SkipButton = ({ onClick, style }) => {
    return (
        <StyledSkipButton onClick={onClick} style={style}>
            <PlayIcon />
            <PlayIcon style={{ marginLeft: '-1px', marginTop: '-2px' }} />
        </StyledSkipButton>
    );
};

const PlayerSpacing = styled(Row)`
    border-right: 1px solid rgb(233, 236, 240, 0.5);
    margin-right: 42px;
    height: 100%;
    padding-right: 42px;
    @media only screen and (max-width: 420px) {
        margin-right: 0px;
        padding-right: 0px;
        border-right: none;
    }
`;

const RightRow = styled(Row)`
    flex: 1;
`;

const Wrapper = styled.div`
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 99;
    background: #fff;
    border-top: 1px solid rgb(233, 236, 240, 0.5);
    padding-bottom: env(safe-area-inset-bottom);
    @supports (backdrop-filter: none) {
        background: rgba(255, 255, 255, 0.4);
        backdrop-filter: saturate(180%) blur(20px);
    }
    ${Container}, ${Row} {
        height: 100%;
    }
`;

const AnimatingWrapper = animated(Wrapper);

const AnimationWrapper = () => {
    const { track, next, previous } = useCurrentDeck();
    const transitions = useTransition(!!track, null, {
        from: {
            transform: 'translate3d(0, 100%,0)',
        },
        enter: { transform: 'translate3d(0,0,0)' },
        leave: { transform: 'translate3d(0,100%,0)' },
    });

    return transitions.map(
        ({ item, key, props }) =>
            item && (
                <AnimatingWrapper key={key} style={props}>
                    <Container style={{ height: '60px' }}>
                        {track && <BottomPlayer track={track} next={next} previous={previous} />}
                    </Container>
                </AnimatingWrapper>
            )
    );
};

export default AnimationWrapper;
