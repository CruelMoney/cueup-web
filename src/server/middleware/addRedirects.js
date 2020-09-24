// from old location urls to new

import enRoutes, { oldRoutes as enOldRoutes } from 'constants/locales/en/routes';
import { oldRoutes as daOldRoutes } from 'constants/locales/da/routes';

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

export const addRedirects = (app) => {
    app.use(
        ['/dk/book-dj/:country/:city?', daOldRoutes.bookDj, enOldRoutes.bookDj],
        redirectOldBookDJ
    );
};
