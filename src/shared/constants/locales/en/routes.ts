import { RouteKeys } from '../appRoutes';

const routes: RouteKeys = {
    home: '/',
    about: '/about',
    howItWorks: '/how-it-works',
    becomeDj: '/become-dj',
    signUp: '/signup',
    user: '/user',
    bookDj: '/book-dj/:country/:city?',
    bookDjOverview: '/book-dj',
    blog: '/blog',
    faq: '/faq',
    faqDj: '/faq/dj',
    faqOrganizer: '/faq/organizer',
    notFound: '/not-found',
    event: '/event',
    completeSignup: '/complete-signup',
    terms: '/terms',
    termsAgreements: '/terms/agreements',
    termsPrivacy: '/terms/privacy',
    gig: '/gig',
    resetPassword: '/resetPassword',
};

export default routes;
