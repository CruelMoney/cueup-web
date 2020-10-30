import { RouteKeys } from '../appRoutes';

const routes: RouteKeys = {
    home: '/',
    about: '/about',
    howItWorks: '/how-it-works',
    becomeDj: '/become-dj',
    signUp: '/signup',
    user: '/user',
    userOverview: '/user/:permalink/overview',
    userBook: '/user/:permalink/booking',
    userBookNew: '/:permalink/book',
    userReviews: '/user/:permalink/reviews',
    userSounds: '/user/:permalink/sounds',
    userPhotos: '/user/:permalink/photos',
    userSettings: '/user/:permalink/settings',
    userEvents: '/user/:permalink/events',
    userGigs: '/user/:permalink/gigs',
    bookDj: '/:location/book-dj',
    bookDjOverview: '/locations',
    search: '/s',
    blog: '/blog',
    faq: '/faq',
    faqDj: '/faq/dj',
    faqOrganizer: '/faq/organizer',
    notFound: '/not-found',
    event: '/event',
    completeSignup: '/complete-signup',
    terms: '/terms',
    termsAgreements: '/terms/agreements',
    termsCookie: '/terms/cookies',
    termsPrivacy: '/terms/privacy',
    gig: '/gig',
    resetPassword: '/resetPassword',
    djNameGenerator: '/dj-name-generator',
};

export const oldRoutes = {
    bookDj: '/book-dj/:country/:city?',
};

export default routes;
