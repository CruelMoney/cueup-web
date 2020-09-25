import { useState, useEffect } from 'react';
import * as Sentry from '@sentry/react';
import getCookie from 'utils/getCookie';
import { loadOneSignal } from 'External/oneSignal';

const DISABLE_NOTIFICATIONS_COOKIE = 'disable-notifications';

const usePushNotifications = (options = {}) => {
    const hasOptedOut = getCookie(DISABLE_NOTIFICATIONS_COOKIE);
    const { userId } = options;
    const [loading, setLoading] = useState(true);
    const [pushIsEnabled, setPushIsEnabled] = useState(false);
    const [pushShouldBeEnabled, setPushShouldBeEnabled] = useState(false);

    useEffect(() => {
        loadOneSignal();
    }, []);

    useEffect(() => {
        if (!hasOptedOut) {
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
        }
    }, [hasOptedOut]);

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

    const optOut = () => {
        const expire = new Date(); // Now
        expire.setDate(expire.getDate() + 30); // 30 days
        expire.toUTCString();
        document.cookie = `${DISABLE_NOTIFICATIONS_COOKIE}=true; path=/; expires = ${expire}`;
        setPushShouldBeEnabled(false);
    };

    return { pushIsEnabled, pushShouldBeEnabled, showPrompt, optOut, loading };
};

export default usePushNotifications;
