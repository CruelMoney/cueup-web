// from old location urls to new

import enRoutes, { oldRoutes as enOldRoutes } from 'constants/locales/en/routes';
import daRoutes, { oldRoutes as daOldRoutes } from 'constants/locales/da/routes';

// /book-dj/country/city -> /location/book-dj
const redirectOldBookDJ = (req, res, next) => {
    let { country, city } = req.params;

    if (city === 'koebenhavn') {
        city = 'copenhagen';
    }
    if (country === 'danmark') {
        country = 'denmark';
    }

    res.redirect(enRoutes.bookDj.replace(':location', city || country));
};

const redirect = (newRoute) => (req, res, next) => {
    return res.redirect(newRoute);
};

export const addRedirects = (app) => {
    app.use(
        ['/dk/book-dj/:country/:city?', daOldRoutes.bookDj, enOldRoutes.bookDj],
        redirectOldBookDJ
    );

    app.use(enOldRoutes.userEvents, redirect(enRoutes.userEvents));
    app.use(enOldRoutes.userGigs, redirect(enRoutes.userGigs));
    app.use(enOldRoutes.userSettings, redirect(enRoutes.userSettings));
    app.use(daOldRoutes.userEvents, redirect(daRoutes.userEvents));
    app.use(daOldRoutes.userGigs, redirect(daRoutes.userGigs));
    app.use(daOldRoutes.userSettings, redirect(daRoutes.userSettings));
};
