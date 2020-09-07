import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import SQL from 'sql-template-strings';
import { appRoutes } from 'constants/locales/appRoutes';
import routes from 'constants/locales/en/routes';

const overviewKey = routes.bookDjOverview;

// for fetching specific country
const locationKey = routes.bookDj;

const getDB = async () => {
    return await open({
        filename: './data/cities.sqlite',
        driver: sqlite3.Database,
    });
};

const addLocationData = (app) => {
    // for fetching all countries
    app.use(routes.bookDjOverview, async (req, res, next) => {
        const db = await getDB();

        const result = await db.all(
            SQL`
                    SELECT country, iso2
                    FROM cities 
                    GROUP BY iso2
                `
        );
        res.locals.countries = result;

        next();
    });

    app.use('/', async (req, res, next) => {
        const COUNTRY_CODE = req.header('cf-ipcountry');
        const db = await getDB();

        if (COUNTRY_CODE && COUNTRY_CODE !== 'XX') {
            const result = await db.all(
                SQL`
                    SELECT *
                    FROM cities 
                    WHERE iso2 = ${COUNTRY_CODE}
                    LIMIT 5
                `
            );
            res.locals.top_cities = result;
        }

        if (!res.locals.top_cities?.length) {
            res.locals.top_cities = fallbackCities;
        }

        await db.close();

        next();
    });
};

const fallbackCities = [
    {
        id: 1,
        city: 'Copenhagen',
    },
    {
        id: 2,
        city: 'Bali',
    },
    {
        id: 3,
        city: 'Los Angeles',
    },
    {
        id: 4,
        city: 'Paris',
    },
];

export default addLocationData;
