export enum AppRoute {
    Home = 'routes.home',
    VerifyEmail = 'routes.verifyEmail',
    Blog = 'routes.blog',
    Signup = 'routes.signup',
}

export const AppRouteTitles = new Map([
    [AppRoute.Home, 'home.title'],
    [AppRoute.Blog, 'blog.title'],
]);
