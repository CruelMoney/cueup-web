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
});

export type RouteKeys = typeof routeKeys;

export const appRoutes: RouteKeys = Object.freeze({
    home: 'routes:home',
    about: 'routes:about',
    howItWorks: 'routes:howItWorks',
    becomeDj: 'routes:becomeDj',
    signUp: 'routes:signup',
    user: 'routes:user',
    bookDj: 'routes:bookDj',
    blog: 'routes:blog',
});
