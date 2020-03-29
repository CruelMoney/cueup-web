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

const all = {
    Environment,
    Currencies,
    CUSTOMER_NOTIFICATIONS,
    NOTIFICATIONS,
    WEEKDAYS,
    GENRES,
    OrganizerCurrencies,
};

export default all;
