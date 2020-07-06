import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import { SettingsSection, Input, DeleteFileButton } from 'components/FormComponents';
import ImageUploader from 'components/ImageInput';
import GenreSelector from 'components/GenreSelector';
import TextAreaPopup from 'components/TextAreaPopup';
import useTranslate from 'components/hooks/useTranslate';
import Popup from 'components/common/Popup';
import PayoutForm from 'components/common/PayoutForm';
import CurrencySelector from 'components/CurrencySelector';
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
    const addPayoutMethod = modal === 'payoutMethods';

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

    const {
        userMetadata,
        genres,
        playingLocation,
        userSettings,
        artistName,
        permalink,
        isDj,
        payoutMethods,
    } = user;
    const { firstName, bio } = userMetadata;
    const { cancelationPolicy, currency } = userSettings;

    return (
        <SettingsSection
            id="profile"
            title={'Profile'}
            description={
                'Edit your profile to make it look good and get more bookings. Make the organizers feel good about booking you!'
            }
        >
            <Input
                half
                label="Artist name"
                attention={!artistName}
                defaultValue={artistName}
                placeholder={'Dj ' + (firstName || 'name')}
                type="text"
                onSave={(artistName) => saveData({ artistName: artistName.trim() })}
            />
            <ImageUploader
                half
                label="Profile picture"
                buttonText="Change picture"
                onSave={updateKey('picture')}
                error={editsMap.profilePictureId?.message}
                displayError
            />
            <Input
                label="Profile URL"
                placeholder="cueup.io/"
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
                buttonText="Change photo"
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
                buttonText={userSettings.standby ? 'Unavailable' : 'Available'}
            />
            {isDj && (
                <PayoutPopup
                    key={addPayoutMethod}
                    user={user}
                    hasPayout={payoutMethods?.length}
                    isActive={addPayoutMethod}
                    onClose={onModalClose}
                />
            )}

            <CurrencySelector
                half
                label="Preferred currency"
                initialValue={currency || ''}
                onSave={(currency) => saveData({ currency })}
            />
        </SettingsSection>
    );
};

const PayoutPopup = ({ user, hasPayout, isActive = false, onClose }) => {
    const [showing, setShowing] = useState(isActive);

    const close = () => {
        onClose();
        setShowing(false);
    };

    return (
        <>
            <Input
                half
                type="button"
                attention={!hasPayout}
                onClick={(s) => setShowing(true)}
                label="Payout methods"
                buttonText={'Update'}
            />
            <Popup showing={showing} onClickOutside={close} width={'600px'}>
                <PayoutForm
                    color={'#31daff'}
                    isUpdate={hasPayout}
                    user={user}
                    onCancel={close}
                    onSubmitted={close}
                />
            </Popup>
        </>
    );
};

export default ProfileSection;
