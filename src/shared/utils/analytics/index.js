import Analytics from 'analytics';
import { useEffect } from 'react';
import { useLocation } from 'react-router';
import { TRACKING_EVENTS } from './events';
import facebookPixelPlugin from './facebookPixelPlugin';
import googleAnalytics from './gtagPlugin';

let analytics = null;

function doNotTrackPlugin(userConfig = {}) {
    return {
        NAMESPACE: 'do-not-track',
        config: Object.assign({}, userConfig),
        initializeStart: ({ abort, config }) => {
            if (config.disableTracking) {
                return abort('Cancel the initialize call because do-not-track enabled');
            }
        },
        pageStart: ({ abort, config }) => {
            if (config.disableTracking) {
                return abort('Cancel the page call because do-not-track enabled');
            }
        },
        identifyStart: ({ abort, config }) => {
            if (config.disableTracking) {
                return abort('Cancel the identify call because do-not-track enabled');
            }
        },
        trackStart: ({ abort, config }) => {
            if (config.disableTracking) {
                return abort('Cancel the track call because do-not-track enabled');
            }
        },
    };
}

export const useAnalytics = ({ disableTracking }) => {
    const location = useLocation();

    if (!analytics) {
        analytics = Analytics({
            app: 'cueup-web',
            debug: true,
            plugins: [
                doNotTrackPlugin({
                    disableTracking,
                }),
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
    analytics.page();
};

export const trackCheckAvailability = (locationName) => {
    analytics.track(TRACKING_EVENTS.Search, {
        category: 'Events',
        search_term: locationName,
    });
};

export const trackSignup = () => {
    analytics.track(TRACKING_EVENTS.Signup, {
        category: 'Users',
    });
};

export const trackEventPosted = () => {
    analytics.track(TRACKING_EVENTS.PostEvent, {
        category: 'Events',
    });
};
export const trackEventPaid = ({ currency, value }) => {
    analytics.track(TRACKING_EVENTS.CompleteBooking, {
        category: 'Events',
        value,
        currency,
    });
};

export const trackCheckout = () => {
    analytics.track(TRACKING_EVENTS.InitiateCompleteBooking, {
        category: 'Events',
    });
};

export const trackEmptySearch = (label) => {
    analytics.track(TRACKING_EVENTS.EmptySearch, {
        category: 'Events',
        label,
    });
};

export const trackLogin = () => {
    analytics.track(TRACKING_EVENTS.Login, {
        category: 'Users',
    });
};

export const trackSendChatMessage = () => {
    analytics.track(TRACKING_EVENTS.SendChatMessage, {
        category: 'Users',
    });
};

export const trackSubscribeToPro = ({ value, currency }) => {
    analytics.track(TRACKING_EVENTS.SubscribeToPro, {
        category: 'Users',
        value,
        currency,
    });
};

export const identifyUser = ({ userId, isPro, isDJ, isOrganizer }) => {
    analytics.identify(userId, { isPro, isDJ, isOrganizer });
};
