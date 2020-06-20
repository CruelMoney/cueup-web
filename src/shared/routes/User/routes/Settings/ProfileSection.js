import React from 'react';
import { useQuery } from 'react-apollo';
import { SettingsSection, Input, DeleteFileButton } from 'components/FormComponents';
import ImageUploader from 'components/ImageInput';
import GenreSelector from 'components/GenreSelector';
import TextAreaPopup from 'components/TextAreaPopup';
import useTranslate from 'components/hooks/useTranslate';
import LocationPicker from '../../components/LocationPicker';
import CancelationPolicyPopup from '../../components/CancelationPolicyPopup';
import { USER_EDITS } from '../../gql';

const ProfileSection = ({ user, modal, onModalClose, updateKey, saveData }) => {
    const { data } = useQuery(USER_EDITS);
    const editsMap = data?.me?.editsMap || {};

    const { translate } = useTranslate();

    const bioModal = modal === 'bio';
    const genresModal = modal === 'genres';
    const locationModal = modal === 'location';
    const cancelationPolicyModal = modal === 'cancelationPolicy';

    const toggleAvailability = () => {
        if (!userSettings.standby) {
            const r = window.confirm(
                'You will not receive any gigs while being on standby. Are you sure?'
            );
            if (r !== true) {
                return;
            }
        }
        updateKey('standby')(!userSettings.standby);
    };

    const { userMetadata, genres, playingLocation, userSettings, artistName, permalink } = user;
    const { firstName, bio } = userMetadata;
    const { cancelationPolicy } = userSettings;

    return (
        <SettingsSection
            id="profile"
            title={'Profile'}
            description={
                'Edit your profile to make it look good and get more bookings. Make the organizers feel good about booking you!'
            }
        >
            <Input
                label="Artist name"
                attention={!artistName}
                defaultValue={artistName}
                placeholder={'Dj ' + (firstName || 'name')}
                type="text"
                onSave={(artistName) => saveData({ artistName: artistName.trim() })}
            />
            <Input
                label="URL"
                placeholder="https://cueup.io/"
                type="formatted-text"
                name="permalink"
                defaultValue={permalink}
                onSave={async (permalink) => {
                    saveData({ permalink: permalink.trim() });
                }}
            />
            <LocationPicker
                isActive={locationModal}
                initialLocation={playingLocation}
                save={(playingLocation) => saveData({ playingLocation })}
                onClose={onModalClose}
            />

            <GenreSelector
                isActive={genresModal}
                initialGenres={genres}
                save={(genres) => saveData({ genres })}
                onClose={onModalClose}
            />
            <CancelationPolicyPopup
                isActive={cancelationPolicyModal}
                initialValue={cancelationPolicy}
                save={(p) =>
                    saveData({
                        refundPercentage: p.percentage,
                        cancelationDays: p.days,
                    })
                }
                translate={translate}
                onClose={onModalClose}
            />
            <TextAreaPopup
                isActive={bioModal}
                initialValue={bio || ''}
                attention={!bio}
                label="Bio"
                save={(bio) =>
                    saveData({
                        bio,
                    })
                }
                error={editsMap.bio?.message}
                onClose={onModalClose}
                displayError
            />

            <ImageUploader
                half
                label="Cover photo"
                buttonText="change photo"
                onSave={updateKey('coverPhoto')}
                options={{ maxWidth: 1440, maxHeight: 400 }}
            >
                {user.coverPhoto && (
                    <DeleteFileButton onClick={(_) => updateKey('coverPhoto')(null)}>
                        x
                    </DeleteFileButton>
                )}
            </ImageUploader>

            <Input
                half
                type="button"
                attention={userSettings.standby}
                label="Standby"
                onClick={toggleAvailability}
                buttonText={userSettings.standby ? 'unavailable' : 'available'}
            />
        </SettingsSection>
    );
};

export default ProfileSection;
