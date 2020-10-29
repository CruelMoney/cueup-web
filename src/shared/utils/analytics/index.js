import Analytics from 'analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import facebookPixelPlugin from './facebookPixelPlugin';
import googleAnalytics from './gtagPlugin';

const shouldTrack = process.env.NODE_ENV === 'production';

let analytics = null;

export const useAnalytics = () => {
    const location = useLocation();

    if (shouldTrack && !analytics) {
        analytics = Analytics({
            app: 'cueup-web',
            plugins: [
                googleAnalytics({
                    trackingId: 'G-1YFGDM8MKZ',
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
    if (shouldTrack) {
        analytics.page();
    }
};

export const trackCheckAvailability = (locationName) => {
    if (shouldTrack) {
        analytics.track('Search', {
            category: 'Events',
            label: locationName,
        });
    }
};

export const trackSignup = () => {
    if (shouldTrack) {
        analytics.track('CompleteRegistration', {
            category: 'Users',
        });
    }
};

export const trackEventPosted = () => {
    if (shouldTrack) {
        analytics.track('Created', {
            category: 'Events',
        });
    }
};
export const trackEventPaid = (value) => {
    if (shouldTrack) {
        analytics.track('Purchase', {
            category: 'Events',
            value,
        });
    }
};

export const trackCheckout = () => {
    if (shouldTrack) {
        analytics.track('InitiateCheckout', {
            category: 'Events',
        });
    }
};

export const trackEmptySearch = (label) => {
    if (shouldTrack) {
        analytics.track('emptySearch', {
            category: 'Events',
            label,
        });
    }
};

export const identifyUser = ({ userId, isPro, isDJ, isOrganizer }) => {
    if (shouldTrack) {
        analytics.identify(userId, { isPro, isDJ, isOrganizer });
    }
};
