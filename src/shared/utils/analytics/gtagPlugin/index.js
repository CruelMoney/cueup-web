const defaultConfig = {
    trackingId: null,
    send_page_view: false, // disable because we manually send
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

    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());
    gtag('config', config.trackingId, config);
};

const gtag = function () {
    // Can't use arrow func + destructuring as Google expects
    // arguments objects in dataLayer (not an array of arguments).
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
            const { title, path, url } = payload.properties;
            gtag('event', 'page_view', {
                page_title: title,
                page_location: url,
                page_path: path,
                send_to: userConfig.trackingId,
            });
        },
        /* Track event */
        track: ({ payload }) => {
            const { category, label, value } = payload.properties;
            gtag('event', payload.event, {
                event_category: category, // good ol' event category
                event_label: label,
                value,
            });
        },
        /* Identify user */
        identify: ({ payload }) => {
            gtag('set', { user_id: payload.userId });
        },
        loaded: () => {
            return true;
        },
    };
}
