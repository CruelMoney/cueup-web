// Import the individual autotrack plugins you want to use.

/* global gtag */

/**
 * The tracking ID for your Google Analytics property.
 * https://support.google.com/analytics/answer/1032385
 */
const TRACKING_ID = 'UA-59876038-4';
const OPTIMIZE_ID = 'GTM-KW2PT4L';
const ADS_ID = 'AW-874592960';

/**
 * Bump this when making backwards incompatible changes to the tracking
 * implementation. This allows you to create a segment or view filter
 * that isolates only data captured with the most recent tracking changes.
 */
const TRACKING_VERSION = '1';

/**
 * A maping between custom dimension names and their indexes.
 */
const dimensions = {
    TRACKING_VERSION: 'dimension1',
    CLIENT_ID: 'dimension2',
    WINDOW_ID: 'dimension3',
    HIT_ID: 'dimension4',
    HIT_TIME: 'dimension5',
    HIT_TYPE: 'dimension6',
    HIT_SOURCE: 'dimension7',
    VISIBILITY_STATE: 'dimension8',
    URL_QUERY_PARAMS: 'dimension9',
};

/**
 * A default value for dimensions so unset values always are reported as
 * something. This is needed since Google Analytics will drop empty dimension
 * values in reports.
 */
const NULL_VALUE = '(not set)';

/**
 * Initializes all the analytics setup. Creates trackers and sets initial
 * values on the trackers.
 */
export const init = () => {
    // Initialize the command queue in case gtag hasn't loaded yet.
    window.dataLayer = window.dataLayer || [];
    window.gtag = function gtag() {
        window.dataLayer.push(arguments);
    };

    createTracker();
    trackErrors();
};

/**
 * Creates the trackers and sets the default transport and tracking
 * version fields. In non-production environments it also logs hits.
 */
const createTracker = () => {
    // google analytics + optimize
    gtag('config', TRACKING_ID, {
        optimize_id: OPTIMIZE_ID,
        transport_type: 'beacon',
        send_page_view: false,
    });

    // Ads
    gtag('config', ADS_ID, {
        transport_type: 'beacon',
        send_page_view: false,
    });
};

export const pageView = (pagePath) => {
    gtag('config', TRACKING_ID, {
        page_path: pagePath,
    });
};

/**
 * Tracks a JavaScript error with optional fields object overrides.
 * This function is exported so it can be used in other parts of the codebase.
 * E.g.:
 *
 *    `fetch('/api.json').catch(trackError);`
 *
 * @param {Error|undefined} error
 * @param {Object=} fieldsObj
 */
export const trackError = (error, fieldsObj = {}) => {
    gtag(
        'event',
        'error',
        Object.assign(
            {
                eventCategory: 'Script',
                eventAction: 'error',
                eventLabel: (error && error.stack) || NULL_VALUE,
                nonInteraction: true,
            },
            fieldsObj
        )
    );
};

export function trackCheckAvailability() {
    gtag('event', 'checkavailability', {
        event_category: 'Event',
    });
    gtag('event', 'conversion', {
        send_to: ADS_ID + '/7KbhCK67m7oBEMD1hKED',
    });
}
export function trackSignup() {
    gtag('event', 'created', {
        event_category: 'Account',
    });
    gtag('event', 'conversion', { send_to: ADS_ID + '/4yucCNLZm7oBEMD1hKED' });
}
export function trackEventPosted() {
    gtag('event', 'created', {
        event_category: 'Event',
    });
    gtag('event', 'conversion', {
        send_to: ADS_ID + '/GXTzCJros7oBEMD1hKED',
    });
}
export function trackEventPaid(val) {
    gtag('event', 'paid', {
        event_category: 'Event',
        value: val,
    });
}

/**
 * Tracks any errors that may have occured on the page prior to analytics being
 * initialized, then adds an event handler to track future errors.
 */
const trackErrors = () => {
    // Errors that have occurred prior to this script running are stored on
    // `window.__e.q`, as specified in `index.html`.
    const loadErrorEvents = (window.__e && window.__e.q) || [];

    // Use a different eventAction for uncaught errors.
    const fieldsObj = { eventAction: 'uncaught error' };

    // Replay any stored load error events.
    for (const event of loadErrorEvents) {
        trackError(event.error, fieldsObj);
    }

    // Add a new listener to track event immediately.
    window.addEventListener('error', (event) => {
        trackError(event.error, fieldsObj);
    });
};
