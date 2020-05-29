import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { Helmet } from 'react-helmet-async';
import { LoadingPlaceholder2 } from '../../../../components/common/LoadingPlaceholder';
import Popup from '../../../../components/common/Popup';
import { Col, SecondaryButton, Row, PrimaryButton } from '../../../../components/Blocks';
import EmptyPage from '../../../../components/common/EmptyPage';
import { Body } from '../../../../components/Text';
import ConnectSounCloud from '../../components/ConnectSoundCloud';
import { USER_SOUNDS } from './gql';
import AddSound from './AddSound';
import Sound from './Sound';

const Sounds = ({ user, location, match, setShowPopup }) => {
    const { id: soundId } = match.params;
    const { isOwn } = user || {};

    const { data, loading } = useQuery(USER_SOUNDS, {
        skip: !user,
        variables: {
            userId: user && user.id,
        },
    });

    const { userSounds } = data || {};
    const { edges = [] } = userSounds || {};

    if ((loading && !user) || !userSounds) {
        return (
            <Col>
                <LoadingPlaceholder2 />
            </Col>
        );
    }

    const { appMetadata } = user;

    if (edges.length === 0) {
        return (
            <EmptyPage
                title="No Tracks"
                message={
                    isOwn ? (
                        <>
                            <Body style={{ marginBottom: 15 }}>
                                Showcase your mixes or productions
                            </Body>
                            <ConnectSounCloud
                                userId={user.id}
                                soundCloudConnected={appMetadata.soundCloudConnected}
                            />
                            <PrimaryButton
                                style={{ marginTop: '9px', width: '100%', maxWidth: '100%' }}
                                onClick={() => setShowPopup(true)}
                            >
                                Upload track
                            </PrimaryButton>
                        </>
                    ) : (
                        ''
                    )
                }
            />
        );
    }

    const selectedSound = edges.find((s) => s.id === soundId);

    return (
        <div>
            {selectedSound && (
                <Helmet>
                    <title>{selectedSound.title}</title>
                    <meta property="og:title" content={selectedSound.title} />
                    <meta name="twitter:title" content={selectedSound.title} />

                    {selectedSound.image && (
                        <meta property="og:image" content={selectedSound.image.path} />
                    )}
                    {selectedSound.image && (
                        <meta property="twitter:image" content={selectedSound.image.path} />
                    )}

                    <meta name="description" content={selectedSound.description} />
                    <meta name="twitter:description" content={selectedSound.description} />
                    <meta property="og:description" content={selectedSound.description} />
                </Helmet>
            )}

            {edges.map((sound) => (
                <Sound
                    key={sound.id}
                    link={location.pathname + '/' + sound.id}
                    isOwn={user.isOwn}
                    userId={user.id}
                    artistName={user.title}
                    {...sound}
                />
            ))}
            {isOwn && (
                <Row style={{ marginTop: '30px', width: '250px' }}>
                    {!appMetadata.soundCloudConnected && (
                        <ConnectSounCloud
                            userId={user.id}
                            soundCloudConnected={appMetadata.soundCloudConnected}
                        />
                    )}
                    <SecondaryButton onClick={() => setShowPopup(true)}>
                        + Add sound
                    </SecondaryButton>
                </Row>
            )}
        </div>
    );
};

const Wrapper = (props) => {
    const { user } = props;
    const [showPopup, setShowPopup] = useState(false);
    const { isOwn } = user || {};

    return (
        <>
            <Sounds {...props} setShowPopup={setShowPopup} />
            {isOwn && (
                <Popup
                    showing={showPopup}
                    onClickOutside={() => setShowPopup(false)}
                    width={'750px'}
                >
                    <AddSound
                        userId={user.id}
                        closeModal={() => setShowPopup(false)}
                        onCancel={() => setShowPopup(false)}
                    />
                </Popup>
            )}
        </>
    );
};

export default Wrapper;
