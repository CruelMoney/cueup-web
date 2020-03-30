// translation keys for the routes

export const routeKeys = Object.freeze({
    home: 'home',
    about: 'about',
    howItWorks: 'howItWorks',
    becomeDj: 'becomeDj',
    signUp: 'signUp',
    user: 'user',
    bookDj: 'bookDj',
    bookDjOverview: 'bookDjOverview',
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
    gig: 'gig',
    resetPassword: 'resetPassword',
});

export type RouteKeys = typeof routeKeys;

// routes with namespace appended
export const appRoutes: RouteKeys = Object.keys(routeKeys).reduce(
    (acc, k) => ({ ...acc, [k]: 'routes:' + k }),
    { ...routeKeys }
);
