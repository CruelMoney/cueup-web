import Analytics from 'analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { TRACKING_EVENTS } from './events';
import facebookPixelPlugin from './facebookPixelPlugin';
import googleAnalytics from './gtagPlugin';

const shouldTrack = true || process.env.SETTING === 'production';

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
        analytics.track(TRACKING_EVENTS.Search, {
            category: 'Events',
            label: locationName,
        });
    }
};

export const trackSignup = () => {
    if (shouldTrack) {
        analytics.track(TRACKING_EVENTS.Signup, {
            category: 'Users',
        });
    }
};

export const trackEventPosted = () => {
    if (shouldTrack) {
        analytics.track(TRACKING_EVENTS.PostEvent, {
            category: 'Events',
        });
    }
};
export const trackEventPaid = (value) => {
    if (shouldTrack) {
        analytics.track(TRACKING_EVENTS.CompleteBooking, {
            category: 'Events',
            value,
        });
    }
};

export const trackCheckout = () => {
    if (shouldTrack) {
        analytics.track(TRACKING_EVENTS.InitiateCompleteBooking, {
            category: 'Events',
        });
    }
};

export const trackEmptySearch = (label) => {
    if (shouldTrack) {
        analytics.track(TRACKING_EVENTS.EmptySearch, {
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
