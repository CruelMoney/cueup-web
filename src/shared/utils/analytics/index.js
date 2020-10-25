import Analytics from 'analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import facebookPixelPlugin from './facebookPixelPlugin';
import googleAnalytics from './gtagPlugin';

const isProd = process.env.NODE_ENV === 'production';

let analytics = null;

export const useAnalytics = () => {
    const location = useLocation();

    if (isProd && !analytics) {
        analytics = Analytics({
            app: 'cueup-web',
            plugins: [
                googleAnalytics({
                    trackingId: 'UA-59876038-4',
                }),
                facebookPixelPlugin({
                    pixelId: '1461498583979582',
                }),
            ],
        });
    }

    useEffect(() => {
        trackPageView();
    }, [location.pathname]);
};

export const trackPageView = () => {
    if (isProd) {
        analytics.page();
    }
};

export const trackCheckAvailability = (locationName) => {
    if (isProd) {
        analytics.track('Search', {
            category: 'Events',
            label: locationName,
        });
    }
};

export const trackSignup = () => {
    if (isProd) {
        analytics.track('CompleteRegistration', {
            category: 'Users',
        });
    }
};

export const trackEventPosted = () => {
    if (isProd) {
        analytics.track('Created', {
            category: 'Events',
        });
    }
};
export const trackEventPaid = (value) => {
    if (isProd) {
        analytics.track('Purchase', {
            category: 'Events',
            value,
        });
    }
};

export const trackCheckout = () => {
    if (isProd) {
        analytics.track('InitiateCheckout', {
            category: 'Events',
        });
    }
};

export const trackEmptySearch = (label) => {
    if (isProd) {
        analytics.track('emptySearch', {
            category: 'Events',
            label,
        });
    }
};

export const saveUserId = (userId) => {
    if (isProd) {
        analytics.identify(userId);
    }
};
