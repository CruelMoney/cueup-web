const keyMirror = require('keymirror');
const frank = require('../assets/images/frank-hansen.png');
const martin = require('../assets/images/martin.jpg');
const oliver = require('../assets/images/oliver.jpg');
const emma = require('../assets/images/emma.png');
const mussa = require('../assets/images/musa.jpg');
const jan = require('../assets/images/jan.png');
const peter = require('../assets/images/peter.png');

const production = process.env.NODE_ENV === 'production';

export const eventStates = {
    INITIAL: 'INITIAL',
    CANCELLED: 'CANCELLED',
    FINISHED: 'FINISHED',
    OFFERING: 'OFFERING',
    ACCEPTED: 'ACCEPTED',
    CONFIRMED: 'CONFIRMED',
    NO_MATCHES: 'NO_MATCHES',
};

export const gigStates = {
    REQUESTED: 'REQUESTED',
    CANCELLED: 'CANCELLED',
    FINISHED: 'FINISHED',
    EVENT_CANCELLED: 'EVENT_CANCELLED',
    ACCEPTED: 'ACCEPTED',
    CONFIRMED: 'CONFIRMED',
    DECLINED: 'DECLINED',
    LOST: 'LOST',
    ORGANIZER_DECLINED: 'ORGANIZER_DECLINED',
};

export const Environment = {
    STRIPE_PUBLIC_KEY: process.env.REACT_APP_STRIPE_PUB_KEY,
    CALLBACK_DOMAIN: process.env.REACT_APP_CUEUP_CALLBACK_DOMAIN,
    GQL_DOMAIN: process.env.REACT_APP_CUEUP_GQL_DOMAIN,
    CHAT_DOMAIN: process.env.REACT_APP_CUEUP_CHAT_DOMAIN,
    FACEBOOK_ID: process.env.REACT_APP_CUEUP_FB_ID,
    PIXEL_ID: '1461498583979582',
    OPENEXCHANGERATE_APP_ID: 'e0937d01cc734837bba7f1bfb6887c2a',
    GOOGLE_API_KEY: production
        ? 'AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ'
        : 'AIzaSyDYsMT5dhTnBLMcAetq4NGVWUyijkrVSHs',
};

export const Currencies = ['DKK', 'EUR', 'GBP', 'NOK', 'SEK', 'USD', 'IDR'];
export const OrganizerCurrencies = ['USD', 'EUR', 'GBP', 'DKK', 'NOK', 'SEK', 'IDR'];

export const AllCurrencies = [
    ...Currencies,
    'CHF',
    'AUD',
    'CAD',
    'HKD',
    'JPY',
    'MYR',
    'NZD',
    'PLN',
    'SGD',
];

export const ActionTypes = keyMirror({
    // Session
    SIGNUP_REQUESTED: null,
    SIGNUP_SUCCEEDED: null,
    SIGNUP_FAILED: null,

    LOGIN_REQUESTED: null,
    LOGIN_REQUESTED_REDIRECT: null,
    LOGIN_SUCCEEDED: null,
    LOGIN_FAILED: null,

    LOGOUT_SUCCEEDED: null,

    UPDATEPROFILE_REQUESTED: null,
    UPDATEPROFILE_SUCCEEDED: null,
    UPDATEPROFILE_FAILED: null,

    UPDATE_PROFILE_VALUE: null,
    UPDATE_PROFILE_META_VALUE: null,
    RESET_PROFILE: null,

    DELETE_PROFILE_REQUESTED: null,
    DELETE_PROFILE_FAILED: null,
    DELETE_PROFILE_SUCCEEDED: null,

    TOGGLE_EDIT_MODE: null,

    FETCH_USER_REQUESTED: null,
    FETCH_USER_SUCCEEDED: null,
    FETCH_USER_FAILED: null,

    // Routes
    REDIRECT: null,

    FORM_UPDATE_VALUE: null,
    FORM_UPDATE_FILTERS: null,
    FORM_RESET: null,
    SET_SIGNUP: null,
    FORM_SUBMIT_REQUESTED: null,
    FORM_SUBMIT_FAILED: null,
    FORM_SUBMIT_SUCCEEDED: null,
    FORM_RESET_STATUS: null,

    FETCH_EVENTS_REQUESTED: null,
    FETCH_EVENTS_SUCCEEDED: null,
    FETCH_EVENTS_FAILED: null,

    FETCH_GIGS_REQUESTED: null,
    FETCH_GIGS_SUCCEEDED: null,
    FETCH_GIGS_FAILED: null,
    GIG_DECLINED: null,
    GIG_CANCELLED: null,
    GIG_OFFER_UPDATED: null,

    FETCH_GIG_REQUESTED: null,
    FETCH_GIG_SUCCEEDED: null,
    FETCH_GIG_FAILED: null,

    FETCH_REVIEWS_REQUESTED: null,
    FETCH_REVIEWS_SUCCEEDED: null,
    FETCH_REVIEWS_FAILED: null,

    CREATE_EVENT_REQUESTED: null,
    CREATE_EVENT_FAILED: null,
    CREATE_EVENT_SUCCEEDED: null,

    CHECK_EMAIL_REQUESTED: null,
    CHECK_EMAIL_FAILED: null,
    CHECK_EMAIL_SUCCEEDED: null,

    UPDATE_GEOLOCATION: null,

    REMOVE_MENU_ITEM: null,
    REGISTER_MENU_ITEM: null,

    TOGGLE_PUBLIC_PROFILE: null,

    CHANGE_CURRENCY: null,
    SET_GEO_SESSION: null,

    NOTIFICATIONS_REQUESTED: null,
    NOTIFICATIONS_SUCCEEDED: null,
    NOTIFICATIONS_FAILED: null,
    NEW_NOTIFICATION: null,
    NOTIFICATION_SEEN: null,
    ROOM_SEEN: null,

    PUSH_PROMISE: null,

    EVENT_CONFIRMED: null,
});
export const GENRES = [
    "80's",
    "90's",
    "00's",
    'R&B',
    'Hip Hop',
    'Reggae',
    'Disco',
    'Rock',
    'Techno',
    'House',
    'Lounge',
    'Top 40',
    'Remixes',
    'Latin',
    'Local',
    'Vinyl',
];
export const WEEKDAYS = [
    { name: 'Monday' },
    { name: 'Tuesday' },
    { name: 'Wednesday' },
    { name: 'Thursday' },
    { name: 'Friday' },
    { name: 'Saturday' },
    { name: 'Sunday' },
];
export const NOTIFICATIONS = [
    { name: 'Gig request' },
    { name: 'Gig reminder' },
    { name: 'Gig paid' },
    { name: 'Queup news' },
    { name: 'New review' },
];
export const CUSTOMER_NOTIFICATIONS = [{ name: 'DJ offer' }, { name: 'Queup news' }];

export const DJs = [
    {
        name: 'Frank',
        location: {
            city: 'Århus',
            country: 'Denmark',
        },
        genres: ['Top 40', '80s', '90s', '00s'],
        img: frank,
    },

    {
        name: 'Emma',
        location: {
            city: 'Copenhagen',
            country: 'Denmark',
        },
        genres: ['Disco', '80s', '90s', 'RnB'],
        img: emma,
    },
    {
        name: 'Musa',
        location: {
            city: 'Copenhagen',
            country: 'Denmark',
        },
        genres: ['Hip Hop', 'Techno', 'Top 40', 'Latin'],
        img: mussa,
    },
    {
        name: 'Martin',
        location: {
            city: 'Copenhagen',
            country: 'Denmark',
        },
        genres: ['Top 40', 'Local', 'Hip Hop', '90s'],
        img: martin,
    },

    {
        name: 'Andreas',
        location: {
            city: 'Copenhagen',
            country: 'Denmark',
        },
        genres: ['Lounge', 'UKG', 'House'],
        img: jan,
    },
    {
        name: 'Peter',
        location: {
            city: 'Århus',
            country: 'Denmark',
        },
        genres: ['Reggae', 'Hip Hop', 'Rock'],
        img: peter,
    },

    {
        name: 'Oliver',
        location: {
            city: 'Odense',
            country: 'Denmark',
        },
        genres: ['House', 'Remixes', "80's", 'Top 40'],
        img: oliver,
    },

    {
        name: 'Emil',
        location: {
            city: 'Copenhagen',
            country: 'Denmark',
        },
        genres: ['Remixes', 'Techno'],
        img: 'https://i1.sndcdn.com/avatars-000077812094-dqnrqd-large.jpg',
    },

    {
        name: 'Casey',
        location: {
            city: 'Bali',
            country: 'Indonesia',
        },
        genres: ['Techno', 'House'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/f5173bd0-a79f-11e9-a31f-2db200fe697d.jpg',
    },
    {
        name: 'Megan',
        location: {
            city: 'London',
            country: 'UK',
        },
        genres: ['Techno', 'House', 'Remixes'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/df9aaa40-a0b9-11e9-b0d7-c9ee46b3b658.jpg',
    },
    {
        name: 'Aim',
        location: {
            city: 'Bali',
            country: 'Indonesia',
        },
        genres: ['House', 'Disco', 'Lounge'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/581b7a60-9e32-11e9-8aec-29be44561459.jpg',
    },

    {
        name: 'Styline',
        location: {
            city: 'Bali',
            country: 'Indonesia',
        },
        genres: ['House', 'Techno'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/070b0e30-9be2-11e9-af61-25d53a33ab8c.jpg',
    },
    {
        name: 'Roman',
        location: {
            city: 'Bali',
            country: 'Indonesia',
        },
        genres: ['Downtempo', 'Vinyl', 'Techno'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/a7b03680-9bb5-11e9-af61-25d53a33ab8c.jpg',
    },
    {
        name: 'Paul',
        location: {
            city: 'Bali',
            country: 'Indonesia',
        },
        genres: ['Disco', 'Minimal house'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/58211a70-9a26-11e9-98fd-4b2bce00c097.jpg',
    },
    {
        name: 'Aaron',
        location: {
            city: 'Bali',
            country: 'Indonesia',
        },
        genres: ['Disco', 'Techno'],
        img:
            'https://d1i5zrp3ng76nh.cloudfront.net/user_uploads/images/6dc09cf0-996f-11e9-8bc4-1ddf38c1cf35.jpg',
    },
];

const all = {
    Environment,
    DJs,
    Currencies,
    CUSTOMER_NOTIFICATIONS,
    NOTIFICATIONS,
    WEEKDAYS,
    GENRES,
    ActionTypes,
    OrganizerCurrencies,
};

export const PAYOUT_TYPES = Object.freeze({
    BANK: 'BANK',
    DIRECT: 'DIRECT',
});
export const PAYMENT_PROVIDERS = Object.freeze({
    STRIPE: 'STRIPE',
    XENDIT: 'XENDIT',
    DIRECT: 'DIRECT',
});

export const EDIT_STATUS = {
    REJECTED: 'REJECTED',
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
};

export default all;
