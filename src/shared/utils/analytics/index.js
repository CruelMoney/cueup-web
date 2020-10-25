import Analytics from 'analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import facebookPixelPlugin from './facebookPixelPlugin';
import googleAnalytics from './gtagPlugin';

const analytics = Analytics({
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

export const trackPageView = () => {
    analytics.page();
};

export const trackCheckAvailability = (locationName) => {
    analytics.track('Search', {
        category: 'Events',
        label: locationName,
    });
};

export const trackSignup = () => {
    analytics.track('CompleteRegistration', {
        category: 'Users',
    });
};

export const trackEventPosted = () => {
    analytics.track('Created', {
        category: 'Events',
    });
};
export const trackEventPaid = (value) => {
    analytics.track('Purchase', {
        category: 'Events',
        value,
    });
};

export const trackCheckout = () => {
    analytics.track('InitiateCheckout', {
        category: 'Events',
    });
};

export const useAnalytics = () => {
    const location = useLocation();

    useEffect(() => {
        trackPageView();
    }, [location.pathname]);
};

export const trackEmptySearch = (label) => {
    analytics.track('emptySearch', {
        category: 'Events',
        label,
    });
};

export const saveUserId = (userId) => {
    analytics.identify(userId);
};
