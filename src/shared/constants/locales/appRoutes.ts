// translation keys for the routes

export const routeKeys = Object.freeze({
    home: 'home',
    about: 'about',
    howItWorks: 'howItWorks',
    becomeDj: 'becomeDj',
    signUp: 'signUp',
    user: 'user',
    userOverview: 'userOverview',
    userBook: 'userBook',
    userBookNew: 'userBookNew',
    userReviews: 'userReviews',
    userSounds: 'userSounds',
    userPhotos: 'userPhotos',
    userSettings: 'userSettings',
    userEvents: 'userEvents',
    userGigs: 'userGigs',
    bookDj: 'bookDj',
    bookDjOverview: 'bookDjOverview',
    search: 'search',
    blog: 'blog',
    faq: 'faq',
    faqDj: 'faqDj',
    faqOrganizer: 'faqOrganizer',
    notFound: 'notFound',
    event: 'event',
    completeSignup: 'completeSignup',
    terms: 'terms',
    termsAgreements: 'termsAgreements',
    termsPrivacy: 'termsPrivacy',
    termsCookie: 'termsCookie',
    gig: 'gig',
    resetPassword: 'resetPassword',
    djNameGenerator: 'djNameGenerator',
});

export const userRoutes = {
    gigs: 'gigs',
    overview: 'overview',
    reviews: 'reviews',
    booking: 'booking',
    sounds: 'sounds',
    events: 'events',
    settings: 'settings',
    photos: 'photos',
    checkout: 'overview/checkout/:gigId',
};

export const eventRoutes = {
    requirements: 'requirements',
    overview: 'overview',
    review: 'review',
    checkout: 'overview/checkout/:gigId',
};

export type RouteKeys = typeof routeKeys;

// routes with namespace appended
export const appRoutes: RouteKeys = Object.keys(routeKeys).reduce(
    (acc, k) => ({ ...acc, [k]: 'routes:' + k }),
    { ...routeKeys }
);
