import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useMutation } from 'react-apollo';
import { Label } from 'components/FormComponents';
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
import { DELETE_SOUND, USER_SOUNDS } from './gql';
import AddSound from './AddSound';
import useScanning from './useScanning';
import SoundBars from './SoundBars';

const Sound = ({
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
                <Title style={{ marginBottom: '39px' }}>{small ? 'Latest Sound' : title}</Title>
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
                        <MonthYearDisplayer date={date} />
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
    margin-top: 8px;
    background: url(${soundcloudLogo});
    background-repeat: no-repeat;
    background-size: contain;
    background-position: right;
    filter: invert(0.5);
`;

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
            {![playerStates.PLAYING, playerStates.LOADING].includes(state) ? (
                <PlayIcon />
            ) : (
                <PauseIcon />
            )}
        </StyledStateButton>
    );
};

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
