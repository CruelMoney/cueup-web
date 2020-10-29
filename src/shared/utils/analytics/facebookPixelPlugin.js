import ReactPixel from 'react-facebook-pixel';
import { TRACKING_EVENTS } from './events';

const defaultConfig = {
    pixelId: null,
    advancedMatching: null,
    autoConfig: true, // set pixel's autoConfig
    debug: false, // enable logs
};

const EventsMapping = {
    [TRACKING_EVENTS.CompleteBooking]: 'Purchase',
    [TRACKING_EVENTS.InitiateCompleteBooking]: 'InitiateCheckout',
    [TRACKING_EVENTS.Login]: 'Login',
    [TRACKING_EVENTS.PageView]: 'ViewContent',
    [TRACKING_EVENTS.PostEvent]: 'Lead',
    [TRACKING_EVENTS.Search]: 'Search',
    [TRACKING_EVENTS.SendChatMessage]: 'Contact',
    [TRACKING_EVENTS.Signup]: 'SubmitApplication',
    [TRACKING_EVENTS.SubscribeToPro]: 'Subscribe',
};

export default function facebookPixelPlugin(userConfig = {}) {
    if (typeof window === 'undefined') {
        return {
            name: 'facebook-pixel',
        };
    }
    return {
        name: 'facebook-pixel',
        config: {
            ...defaultConfig,
            ...userConfig,
        },
        initialize: ({ config: { pixelId, advancedMatching, ...options } }) => {
            if (typeof window !== 'undefined') {
                ReactPixel.init(pixelId, advancedMatching, options);
            }
        },
        page: ({ payload }) => {
            ReactPixel.pageView();
        },
        /* Track event */
        track: ({ payload }) => {
            const { event } = payload;
            const fbEvent = EventsMapping[event];
            if (fbEvent) {
                ReactPixel.track(fbEvent);
            }
        },
        /* Identify user */
        identify: ({ payload, config }) => {
            const advancedMatching = {
                ...payload,
            };
            // ReactPixel.init(config.pixelId, advancedMatching, config.options);
        },
        loaded: () => {
            return window.fbq;
        },
    };
}
