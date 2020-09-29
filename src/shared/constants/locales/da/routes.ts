import { RouteKeys } from '../appRoutes';

const routes: RouteKeys = {
    home: '/da',
    about: '/da/om',
    howItWorks: '/da/hvordan-det-virker',
    becomeDj: '/da/bliv-dj',
    signUp: '/da/tilmeld',
    user: '/da/user',
    userOverview: '/da/user/:permalink/overview',
    userBook: '/da/user/:permalink/booking',
    userReviews: '/da/user/:permalink/reviews',
    userSounds: '/da/user/:permalink/sounds',
    userPhotos: '/da/user/:permalink/photos',
    userSettings: '/da/user/:permalink/settings',
    userEvents: '/da/user/:permalink/events',
    userGigs: '/da/user/:permalink/gigs',
    bookDj: '/da/:location/lej-dj',
    bookDjOverview: '/da/lokationer',
    search: '/da/s/:query?',
    blog: '/da/blog',
    faq: '/da/faq',
    faqDj: '/da/faq/dj',
    faqOrganizer: '/da/faq/arrangoer',
    notFound: '/da/ikke-fundet',
    event: '/da/event',
    completeSignup: '/da/completeSignup',
    terms: '/da/betingelser',
    gig: '/da/gig',
    resetPassword: '/da/resetPassword',
    termsAgreements: '/da/betingelser/aftaler',
    termsPrivacy: '/da/betingelser/privatliv',
    termsCookie: '/da/betingelser/cookies',
    djNameGenerator: '/da/dj-name-generator',
};

export const oldRoutes = {
    bookDj: '/da/lej-dj/:country/:city?',
};

export default routes;
