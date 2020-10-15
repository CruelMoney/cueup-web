import React, { useState } from 'react';
import { SettingsSection, LabelHalf } from 'components/FormComponents';

import { BodySmall } from 'components/Text';
import ConnectSoundCloud from '../../components/ConnectSoundCloud';
import ConnectMixcloudButton from '../../components/ConnectMixcloud';
import ConnectInstagram from '../../components/ConnectInstagram';

const SocialProfiles = ({ user }) => {
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
            title={'Connected profiles'}
            description={
                'Connect services to display their data on your Cueup profile.\n\nConnect both Mixcloud and Soundcloud to upload and manage sounds on both platforms from Cueup.'
            }
        >
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
            <LabelHalf />
        </SettingsSection>
    );
};

export default SocialProfiles;
