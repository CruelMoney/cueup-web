import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import SQL from 'sql-template-strings';
import slugify from 'slugify';
import * as geolib from 'geolib';
import enRoutes from 'constants/locales/en/routes';
import daRoutes from 'constants/locales/da/routes';
// for fetching specific country
// const locationKey = routes.bookDj;

const getDB = async () => {
    return await open({
        filename: './data/cities.sqlite',
        driver: sqlite3.Database,
    });
};

const addLocationData = async (app) => {
    // add slugs on new entries
    // await addSlugs();

    // for fetching all countries
    app.use([enRoutes.bookDjOverview, daRoutes.bookDjOverview], async (req, res, next) => {
        const db = await getDB();

        const result = await db.all(
            SQL`
                    SELECT country, countrySlug, iso2
                    FROM cities 
                    GROUP BY iso2
                `
        );
        res.locals.countries = result;
        await db.close();

        next();
    });

    app.use([enRoutes.bookDj, daRoutes.bookDj], async (req, res, next) => {
        const { country, city } = req.params;

        const db = await getDB();

        if (city) {
            const result = await db.get(
                SQL`
                        SELECT *
                        FROM cities
                        WHERE countrySlug = ${country} AND citySlug = ${city}
                    `
            );
            if (result) {
                const { population, city, country: countryName, lat, lng } = result;
                const radius = (Math.sqrt(population) / Math.log2(population)) * 500; // set based on population

                res.locals.activeLocation = {
                    name: city,
                    city,
                    country: countryName,
                    coords: {
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    },
                    radius,
                };
            }
        } else if (country) {
            const result = await db.all(
                SQL`
                        SELECT *
                        FROM cities
                        WHERE countrySlug = ${country}
                        LIMIT 50
                    `
            );
            if (result.length) {
                // calculate based on cities
                const points = result.map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
                const center = geolib.getCenterOfBounds(points);
                const bounds = geolib.getBounds(points);

                const coords = {
                    lat: center.latitude,
                    lng: center.longitude,
                };

                res.locals.activeLocation = {
                    name: result[0]?.country,
                    city: null,
                    country: result[0]?.country,
                    coords,
                    radius: 25000, // set based on bounding box
                    cities: result,
                    bounds,
                };
            }
        }

        await db.close();

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
        countrySlug: 'denmark',
        citySlug: 'copenhagen',
    },
    {
        id: 2,
        city: 'Bali',
        countrySlug: 'indonesia',
        citySlug: 'bali',
    },
    {
        id: 3,
        city: 'Los Angeles',
        countrySlug: 'united-states',
        citySlug: 'los-angeles',
    },
    {
        id: 4,
        city: 'Paris',
        countrySlug: 'france',
        citySlug: 'paris',
    },
];

export const getLocationUrls = async () => {
    const db = await getDB();

    const result = await db.all(
        SQL`
                SELECT citySlug, countrySlug
                FROM cities 
            `
    );

    await db.close();

    return result.map(({ citySlug, countrySlug }) => `/book-dj/${countrySlug}/${citySlug}`);
};

// const addSlugs = async () => {
//     const db = await getDB();

//     const cities = await db.all(
//         SQL`
//             SELECT id, country, city_ascii
//             FROM cities
//         `
//     );

//     for (const city of cities) {
//         const result = await db.run(
//             SQL`UPDATE cities SET citySlug = ${slugify(city.city_ascii, {
//                 replacement: '-',
//                 lower: true,
//             })}, countrySlug = ${slugify(city.country, {
//                 replacement: '-',
//                 lower: true,
//             })} WHERE id = ${city.id}`
//         );
//     }

//     await db.close();
// };

export default addLocationData;
