import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import {
    SettingsSection,
    Input,
    DeleteFileButton,
    Label,
    ProFeature,
} from 'components/FormComponents';
import ImageUploader from 'components/ImageInput';
import GenreSelector from 'components/GenreSelector';
import TextAreaPopup from 'components/TextAreaPopup';
import useTranslate from 'components/hooks/useTranslate';
import Popup from 'components/common/Popup';
import PayoutForm from 'components/common/PayoutForm';
import CurrencySelector from 'components/CurrencySelector';
import { validators } from 'components/hooks/useForm';
import { CheckBoxRow, TableRow } from 'components/CheckboxTable';
import { Hr, Col } from 'components/Blocks';
import { BodySmall } from 'components/Text';
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
        appMetadata,
        genres,
        playingLocation,
        userSettings,
        artistName,
        permalink,
        isDj,
        payoutMethods,
    } = user;
    const { firstName, bio, website } = userMetadata;
    const { cancelationPolicy, currency } = userSettings;
    const isPro = appMetadata?.isPro;

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
            <Input
                proFeature
                isPro={isPro}
                label="Website"
                defaultValue={website}
                placeholder={`www.${
                    permalink?.length < 20 ? permalink : `dj-${firstName.toLowerCase()}`
                }.com`}
                type="text"
                onSave={(website) => saveData({ website: getUrl(website) })}
                validation={(value) =>
                    validators.containsURL(true)(value) ? null : 'Not a valid URL'
                }
                disabled={!isPro}
                style={{ opacity: isPro ? 1 : 0.5 }}
            />

            <LocationPicker
                isActive={locationModal}
                initialLocation={playingLocation}
                save={(playingLocation) => saveData({ playingLocation })}
                onClose={onModalClose}
                isPro={isPro}
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
                proFeature
                isPro={isPro}
                label="Cover photo"
                disabled={!isPro}
                style={{ opacity: isPro ? 1 : 0.5 }}
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

            <PublicDisplaySettings
                user={user}
                onSave={(publicDisplaySettings) => saveData({ publicDisplaySettings })}
                disabled={!isPro}
                isPro={isPro}
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

const getUrl = (value) => {
    function addhttp(url) {
        if (!/^(?:f|ht)tps?:\/\//.test(url)) {
            url = 'https://' + url;
        }
        return url;
    }

    return new URL(addhttp(value));
};

const PublicDisplaySettings = ({ user, onSave, disabled, isPro }) => {
    const { publicDisplay = {} } = user?.userSettings || {};
    const [internal, setInternal] = useState(publicDisplay);

    const onChange = (key) => (val) => {
        if (disabled) {
            return;
        }
        const newNotifications = {
            ...internal,
            [key]: {
                ...internal[key],
                public: val,
            },
        };
        setInternal(newNotifications);
        onSave(newNotifications);
    };

    return (
        <Col style={{ width: '100%', marginRight: '36px' }}>
            <TableRow>
                <Label>
                    Public information <ProFeature small disabled={isPro} />
                </Label>
                <Label>Public</Label>
            </TableRow>
            <Hr />
            <div style={{ opacity: disabled ? 0.5 : 1, pointerEvents: disabled ? 'none' : 'auto' }}>
                <CheckBoxRow
                    label="Website"
                    withBorder={false}
                    checked={!disabled && internal.WEBSITE?.public}
                    onChange={onChange('WEBSITE')}
                />
                <CheckBoxRow
                    label="Email"
                    withBorder={false}
                    checked={!disabled && internal.EMAIL?.public}
                    onChange={onChange('EMAIL')}
                />
                <CheckBoxRow
                    label="Phone"
                    withBorder={false}
                    checked={!disabled && internal.PHONE?.public}
                    onChange={onChange('PHONE')}
                />
                <CheckBoxRow
                    label="Mixcloud"
                    withBorder={false}
                    checked={!disabled && internal.MIXCLOUD?.public}
                    onChange={onChange('MIXCLOUD')}
                />
                <CheckBoxRow
                    label="SoundCloud"
                    withBorder={false}
                    checked={!disabled && internal.SOUNDCLOUD?.public}
                    onChange={onChange('SOUNDCLOUD')}
                />

                <CheckBoxRow
                    label="Instagram"
                    withBorder={false}
                    checked={!disabled && internal.INSTAGRAM?.public}
                    onChange={onChange('INSTAGRAM')}
                />
            </div>
            <Hr />
            <BodySmall style={{ marginTop: 6 }}>
                Publicly display your contact information and social links on your profile.
                Organizers will always be able to see contact information.
            </BodySmall>
        </Col>
    );
};

export default ProfileSection;
