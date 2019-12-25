import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/browser';

const usePushNotifications = (options = {}) => {
    const { userId } = options;
    const [loading, setLoading] = useState(true);
    const [pushIsEnabled, setPushIsEnabled] = useState(false);
    const [pushShouldBeEnabled, setPushShouldBeEnabled] = useState(false);

    useEffect(() => {
        try {
            window.OneSignal.push(async () => {
                const supported = window.OneSignal.isPushNotificationsSupported();
                const alreadyEnabled = await window.OneSignal.isPushNotificationsEnabled();
                setPushIsEnabled(alreadyEnabled);
                setPushShouldBeEnabled(!alreadyEnabled && supported);
                setLoading(false);
            });
        } catch (error) {
            console.warn(error);
            Sentry.captureException(error);
        }
    }, []);

    const showPrompt = () => {
        window.OneSignal.push(() => {
            window.OneSignal.showNativePrompt();
            if (userId) {
                window.OneSignal.setExternalUserId(userId);
            } else {
                console.warn('UserId not provided for notification');
            }
        });
    };

    return { pushIsEnabled, pushShouldBeEnabled, showPrompt, loading };
};

export default usePushNotifications;
