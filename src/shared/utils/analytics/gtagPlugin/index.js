import { TRACKING_EVENTS } from '../events';

const defaultConfig = {
    trackingId: null,
};

const EventsMapping = {
    [TRACKING_EVENTS.CompleteBooking]: 'purchase',
    [TRACKING_EVENTS.InitiateCompleteBooking]: 'begin_checkout',
    [TRACKING_EVENTS.Login]: 'login',
    [TRACKING_EVENTS.PageView]: 'page_view',
    [TRACKING_EVENTS.PostEvent]: 'generate_lead',
    [TRACKING_EVENTS.Search]: 'search',
    [TRACKING_EVENTS.SendChatMessage]: 'send_message',
    [TRACKING_EVENTS.Signup]: 'sign_up',
    [TRACKING_EVENTS.SubscribeToPro]: 'subscribe',
    [TRACKING_EVENTS.EmptySearch]: 'empty_search',
};

const install = (config) => {
    const scriptId = 'ga-gtag';

    if (document.getElementById(scriptId)) {
        return;
    }

    const { head } = document;
    const script = document.createElement('script');
    script.id = scriptId;
    script.type = 'text/javascript';
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${config.trackingId}`;
    head.insertBefore(script, head.firstChild);

    gtag('js', new Date());
    gtag('config', config.trackingId, {
        optimize_id: 'OPT-KHGSR4C',
    });
};

export const gtag = function () {
    // Can't use arrow func + destructuring as Google expects
    // arguments objects in dataLayer (not an array of arguments).
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(arguments);
};

export default function analyticsGtagPlugin(userConfig = {}) {
    if (typeof window === 'undefined') {
        return {
            name: 'analytics-gtag-plugin',
        };
    }
    return {
        name: 'analytics-gtag-plugin',
        config: {
            ...defaultConfig,
            ...userConfig,
        },
        initialize: ({ config }) => {
            if (typeof window !== 'undefined') {
                install(config);
            }
        },
        page: ({ payload }) => {
            // do nothing, will be tracked auto
        },
        /* Track event */
        track: ({ payload }) => {
            const gaEvent = EventsMapping[payload.event];

            if (gaEvent) {
                gtag('event', gaEvent, payload.properties);
            }
        },
        /* Identify user */
        identify: ({ payload }) => {
            gtag('set', { user_id: payload.userId });
            gtag('set', 'user_properties', payload.traits);
        },
        loaded: () => {
            return true;
        },
    };
}
