import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import SQL from 'sql-template-strings';

const addLocationData = (app) => {
    app.use('/', async (req, res, next) => {
        const COUNTRY_CODE = req.header('cf-ipcountry') || 'DK';
        if (COUNTRY_CODE && COUNTRY_CODE !== 'XX') {
            const db = await open({
                filename: './data/cities.sqlite',
                driver: sqlite3.Database,
            });

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

        next();
    });
};

export default addLocationData;
