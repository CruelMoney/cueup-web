import ReactPixel from 'react-facebook-pixel';

const defaultConfig = {
    pixelId: null,
    advancedMatching: null,
    autoConfig: true, // set pixel's autoConfig
    debug: false, // enable logs
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
            ReactPixel.track(event);
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
