import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import { useHistory } from 'react-router';
import { SettingsSection, Input, LabelHalf } from 'components/FormComponents';
import Popup from 'components/common/Popup';
import useTranslate from 'components/hooks/useTranslate';
import { DELETE_USER } from '../../gql';
import VerifyIdentity from '../../components/VerifyIdentity';
import ConnectSoundCloud from '../../components/ConnectSoundCloud';
import ConnectMixcloudButton from '../../components/ConnectMixcloud';
import ConnectInstagram from '../../components/ConnectInstagram';

const SystemSection = ({ user, modal, onModalClose }) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const verifyIdentity = modal === 'verifyIdentity';

    const { appMetadata, isDj } = user;
    const {
        instagramConnected,
        identityVerified,
        soundCloudConnected,
        mixcloudConnected,
    } = appMetadata;

    return (
        <SettingsSection
            id="system"
            title={'System'}
            description={
                'Connect services to display their data on your Cueup profile.\n\nConnect both Mixcloud and Soundcloud to upload and manage sounds on both platforms from Cueup.\n\nMixcloud shows cannot be displayed on Cueup.'
            }
        >
            <Mutation
                mutation={DELETE_USER}
                variables={{
                    id: user.id,
                }}
                onCompleted={() => {
                    history.push('/');
                }}
            >
                {(deleteUser) => {
                    const doMutate = () => {
                        const confirmed = window.confirm(
                            translate('user:preferences.delete-warning')
                        );
                        if (!confirmed) {
                            return;
                        }
                        deleteUser();
                    };

                    return (
                        <Input
                            half
                            type="button"
                            label="Delete user"
                            warning={true}
                            onClick={() => doMutate()}
                            buttonText="delete"
                        />
                    );
                }}
            </Mutation>
            <Input
                half
                type="button"
                label="Export all data"
                buttonText="export"
                onClick={(_) => window.alert("We'll send you an email when your data is ready.")}
            />
            <VerifyIdentityPopup
                user={user}
                identityVerified={identityVerified}
                initialShowing={verifyIdentity}
                onClose={onModalClose}
            />

            <LabelHalf>
                Connect Instagram
                <ConnectInstagram instagramConnected={instagramConnected} />
            </LabelHalf>

            {isDj && (
                <LabelHalf>
                    Connect SoundCloud
                    <ConnectSoundCloud soundCloudConnected={soundCloudConnected} userId={user.id} />
                </LabelHalf>
            )}
            {isDj && (
                <LabelHalf>
                    Connect Mixcloud
                    <ConnectMixcloudButton mixcloudConnected={mixcloudConnected} userId={user.id} />
                </LabelHalf>
            )}
        </SettingsSection>
    );
};

const VerifyIdentityPopup = ({ user, onClose, identityVerified, initialShowing = false }) => {
    const [showing, setShowing] = useState(initialShowing);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    return (
        <>
            <Input
                half
                type="button"
                onClick={(s) => setShowing(true)}
                label="Verify identity"
                buttonText={identityVerified ? 'verified' : 'get verified'}
                success={identityVerified}
                disabled={identityVerified}
            />
            <Popup
                showing={showing}
                onClickOutside={(_) => closeModal()}
                style={{ maxWidth: '1000px' }}
            >
                <VerifyIdentity
                    isUpdate={identityVerified}
                    user={user}
                    onCancel={(_) => closeModal()}
                />
            </Popup>
        </>
    );
};

export default SystemSection;
