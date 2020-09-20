// from old location urls to new

import enRoutes, { oldRoutes as enOldRoutes } from 'constants/locales/en/routes';
import { oldRoutes as daOldRoutes } from 'constants/locales/da/routes';

// /book-dj/country/city -> /location/book-dj
const redirectOldBookDJ = (req, res, next) => {
    const { country, city } = req.params;
    res.redirect(enRoutes.bookDj.replace(':location', city || country));
};

export const addRedirects = (app) => {
    app.use([daOldRoutes.bookDj, enOldRoutes.bookDj], redirectOldBookDJ);
};
