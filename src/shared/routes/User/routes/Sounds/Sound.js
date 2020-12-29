import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useMeasure } from '@softbind/hook-use-measure';
import { InlineIcon } from '@iconify/react';
import shareIcon from '@iconify/icons-ion/share';
import Logo from 'components/common/Logo';
import { useServerContext } from 'components/hooks/useServerContext';
import { Title, BodySmall, SmallBold, H3 } from '../../../../components/Text';
import { Row, Pill, SecondaryButton, SmartButton, Col } from '../../../../components/Blocks';
import PlayIcon from '../../../../assets/icons/PlayIcon';
import PauseIcon from '../../../../assets/icons/PauseIcon';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';
import Popup from '../../../../components/common/Popup';
import GracefullImage from '../../../../components/GracefullImage';
import soundcloudLogo from '../../../../assets/soundcloud-logo.png';
import useSoundPlayer, { playerStates } from './useSoundPlayer';
import AddSound from './AddSound';
import useScanning from './useScanning';
import SoundBars from './SoundBars';
import RemoveSound from './RemoveSound';
import ShareSound from './ShareSound';

export const SoundDumb = (props) => {
    const ref = useRef(null);
    const { bounds } = useMeasure(ref, 'bounds');

    const { width } = bounds || {};

    return (
        <Container ref={ref} small={props.small} isWidget={props.isWidget}>
            <SoundPlayer {...props} width={width} />
        </Container>
    );
};

const SoundPlayer = ({
    url,
    title,
    date,
    tags,
    duration,
    player,
    samples,
    isOwn,
    loadingRemove,
    deleteSound,
    onEdit,
    small,
    image,
    demo,
    source,
    isWidget,
    user,
    onShare,
    width,
}) => {
    const { environment } = useServerContext();

    const isSoundcloud = source === 'soundcloud';

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

    const { artistName, permalink, userMetadata } = user || {};
    const byName = artistName || userMetadata?.firstName;
    const artistLink = permalink && `${environment.WEBSITE_URL}/user/${permalink}`;

    return (
        <>
            <Row>
                {!small && image && (!width || width >= 500) && (
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        <AlbumCover src={image.path} />
                    </a>
                )}
                <Col style={{ flex: '1' }}>
                    <Row
                        between
                        style={{
                            marginBottom: small ? '9px' : undefined,
                        }}
                    >
                        <PlayPauseButton state={player.state} onClick={togglePlay} />
                        <Col
                            center
                            style={{ marginLeft: '12px', alignItems: 'flex-start', height: 45 }}
                        >
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <H3
                                    numberOfLines={1}
                                    style={{
                                        fontSize: 16,
                                        margin: 0,
                                    }}
                                >
                                    {title}
                                </H3>
                            </a>

                            <a href={artistLink} target="_blank" rel="noopener noreferrer">
                                <BodySmall numberOfLines={1}>{byName}</BodySmall>
                            </a>
                        </Col>

                        {player.error && (
                            <ErrorMessageApollo
                                style={{ marginLeft: '15px' }}
                                error={player.error}
                            />
                        )}
                        <div style={{ flex: 1 }} />
                        {!isWidget && <MonthYearDisplayer date={date} />}
                        {width >= 600 && (
                            <Genres>
                                {tags.map((g) => (
                                    <Pill key={g}>{g}</Pill>
                                ))}
                            </Genres>
                        )}
                        {!small && image && width < 500 && (
                            <a href={url} target="_blank" rel="noopener noreferrer">
                                <AlbumCoverMobile src={image.path} />
                            </a>
                        )}
                    </Row>
                    <SoundBars
                        loading={player.loading}
                        progress={player.progress}
                        samples={samples}
                        duration={duration}
                        setScanningPosition={setScanningPosition}
                        small={small || width < 400}
                        scanningPosition={scanningPosition}
                        jumpOrStart={jumpOrStart}
                    />

                    <Row between middle>
                        <Row>
                            <BodySmall style={{ fontSize: 14 }}>{progressFormatted}</BodySmall>
                            <BodySmall style={{ fontSize: 14, margin: '0 0.5em' }}>{'/'}</BodySmall>
                            <BodySmall style={{ fontSize: 14 }}>{durationFormatted}</BodySmall>
                        </Row>
                        <div style={{ flex: 1 }} />
                        {isWidget && (
                            <a href="https://cueup.io" target="_blank" rel="noopener noreferrer">
                                <Logo height={16} width={38} />
                            </a>
                        )}
                        {!isWidget && !small && (
                            <>
                                {isSoundcloud && <SoundCloudLogo />}
                                {isOwn && (
                                    <SmartButton
                                        loading={loadingRemove}
                                        onClick={deleteSound}
                                        level="tertiary"
                                        small
                                        style={{ minWidth: 0 }}
                                    >
                                        Remove
                                    </SmartButton>
                                )}
                                {isOwn && (
                                    <SecondaryButton small onClick={onEdit} style={{ minWidth: 0 }}>
                                        Edit
                                    </SecondaryButton>
                                )}
                            </>
                        )}
                        {onShare && !isWidget && !small && (
                            <SecondaryButton small style={{ minWidth: 0 }} onClick={onShare}>
                                <InlineIcon
                                    icon={shareIcon}
                                    style={{ marginRight: '0.5em', marginBottom: '-2px' }}
                                />
                                Share
                            </SecondaryButton>
                        )}
                    </Row>
                </Col>
            </Row>
        </>
    );
};

const MonthYearDisplayer = ({ date }) => {
    if (!date) {
        return null;
    }

    // this date is in utc, but we are only interested in year and month so convert
    const dateObject = new Date(date);
    const year = dateObject.getUTCFullYear();
    const month = dateObject.getUTCMonth();

    const formatted = new Date(year, month).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'long',
    });

    return <SmallBold style={{ marginTop: 2, marginRight: 6 }}>{formatted}</SmallBold>;
};

const SoundCloudLogo = styled.div`
    width: 78px;
    height: 12px;
    background: url(${soundcloudLogo});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right;
    filter: invert(0.5);
`;

const Container = styled.article`
    margin-bottom: ${({ small, isWidget }) => (isWidget ? '' : small ? '15px' : '60px')};
    padding-bottom: ${({ small, isWidget }) => (small || isWidget ? ' ' : '24px')};
    border-bottom: ${({ small, isWidget }) => (small || isWidget ? ' ' : '1px solid #e9ecf0')};
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

const StyledStateButton = styled.button`
    display: flex;
    height: 45px;
    width: 45px;
    min-width: 45px;
    border: 1px solid #50e3c2 !important;
    border-radius: 50%;
    justify-content: center;
    align-items: center;
    background: transparent;
    cursor: pointer;
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
            {![playerStates.PLAYING, playerStates.LOADING].includes(state) ? (
                <PlayIcon />
            ) : (
                <PauseIcon />
            )}
        </StyledStateButton>
    );
};

const Sound = (props) => {
    const { id, file, duration, userId, isOwn, title, description, tags } = props;
    const player = useSoundPlayer({
        src: file.path,
        duration: duration.totalSeconds,
        track: props,
    });
    const [showPopup, setShowPopup] = useState(false);
    const [share, setShare] = useState(false);
    const [removePopup, setShowRemove] = useState(false);

    return (
        <>
            <SoundDumb
                {...props}
                player={player}
                deleteSound={() => setShowRemove(true)}
                onEdit={() => setShowPopup(true)}
                onShare={() => setShare(true)}
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

            {isOwn && (
                <Popup
                    showing={removePopup}
                    onClickOutside={() => setShowRemove(false)}
                    width={'500px'}
                >
                    <RemoveSound
                        userId={userId}
                        sound={props}
                        initialData={{
                            id,
                            title,
                            description,
                            tags,
                        }}
                        onCancel={() => setShowRemove(false)}
                        closeModal={() => setShowRemove(false)}
                    />
                </Popup>
            )}
            {share && (
                <Popup showing width={'700px'} onClickOutside={() => setShare(false)}>
                    <ShareSound {...props} />
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
`;

const AlbumCoverMobile = styled(AlbumCover)`
    width: 50px;
    min-width: 50px;
    height: 50px;
    border-radius: 1px;
    margin-right: 0px;
    margin-left: 10px;
`;

export default Sound;
