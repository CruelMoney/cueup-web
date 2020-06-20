import React, { useState } from 'react';
import { SettingsSection, Input } from 'components/FormComponents';
import PayoutForm from 'components/common/PayoutForm';
import Popup from 'components/common/Popup';
import CurrencySelector from 'components/CurrencySelector';
import NotificationPreferences from '../../components/NotificationPreferences';

const PreferencesSection = ({ user, modal, onModalClose, saveData }) => {
    const addPayoutMethod = modal === 'payoutMethods';

    const { appMetadata, userSettings, isDj, payoutMethods } = user;

    const { currency, notifications } = userSettings;
    const { roles } = appMetadata;

    return (
        <SettingsSection
            id="preferences"
            title={'Preferences'}
            description={'Change your preferences for getting paid and notifications.'}
        >
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

            <NotificationPreferences
                notifications={notifications}
                onSave={(notificationSettings) => saveData({ notificationSettings })}
                roles={roles}
                userId={user.id}
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
                buttonText={'update'}
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

export default PreferencesSection;
