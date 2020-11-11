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
    userBookDirect: '/da/:permalink/book',
    userReviews: '/da/user/:permalink/reviews',
    userSounds: '/da/user/:permalink/sounds',
    userPhotos: '/da/user/:permalink/photos',
    userSettings: '/da/u/settings',
    userEvents: '/da/u/events',
    userGigs: '/da/u/gigs',
    bookDj: '/da/:location/lej-dj',
    bookDjOverview: '/da/lokationer',
    search: '/da/s',
    blog: '/da/blog',
    faq: '/da/faq',
    faqDj: '/da/faq/dj',
    faqOrganizer: '/da/faq/arrangoer',
    notFound: '/da/ikke-fundet',
    event: '/da/event',
    completeSignup: '/da/completeSignup',
    terms: '/da/betingelser',
    gig: '/da/gig',
    opportunity: '/da/opportunity',
    resetPassword: '/da/resetPassword',
    termsAgreements: '/da/betingelser/aftaler',
    termsPrivacy: '/da/betingelser/privatliv',
    termsCookie: '/da/betingelser/cookies',
    djNameGenerator: '/da/dj-name-generator',
    djsNearMe: '/s/djs-i-naerheden',
    login: '/da/login',
};

export const oldRoutes = {
    bookDj: '/da/lej-dj/:country/:city?',
    userSettings: '/da/user/:permalink/settings',
    userEvents: '/da/user/:permalink/events',
    userGigs: '/da/user/:permalink/gigs',
};

export default routes;
