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
    INITIAL: 'INITIAL',
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
    Currencies,
    CUSTOMER_NOTIFICATIONS,
    NOTIFICATIONS,
    WEEKDAYS,
    GENRES,
    OrganizerCurrencies,
};

export default all;
