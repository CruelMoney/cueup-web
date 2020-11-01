import React, { useState } from 'react';
import { SettingsSection } from 'components/FormComponents';

import NotificationPreferences from './components/NotificationPreferences';

const PreferencesSection = ({ user, saveData }) => {
    const { appMetadata, userSettings } = user;

    const { notifications } = userSettings;
    const { roles } = appMetadata;

    return (
        <SettingsSection
            id="preferences"
            title={'Notifications'}
            description={'Change your preferences for notifications.'}
            stickyTop={'15px'}
        >
            <NotificationPreferences
                notifications={notifications}
                onSave={(notificationSettings) => saveData({ notificationSettings })}
                roles={roles}
                userId={user.id}
            />
        </SettingsSection>
    );
};

export default PreferencesSection;
