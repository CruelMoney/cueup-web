// translation keys for the routes

export const routeKeys = Object.freeze({
    home: 'home',
    about: 'about',
    howItWorks: 'howItWorks',
    becomeDj: 'becomeDj',
    signUp: 'signUp',
    user: 'user',
    bookDj: 'bookDj',
    blog: 'blog',
    faq: 'faq',
    faqDj: 'faqDj',
    faqOrganizer: 'faqOrganizer',
    notFound: 'notFound',
    event: 'event',
});

export type RouteKeys = typeof routeKeys;

// routes with namespace appended
export const appRoutes: RouteKeys = Object.keys(routeKeys).reduce(
    (acc, k) => ({ ...acc, [k]: 'routes:' + k }),
    { ...routeKeys }
);
