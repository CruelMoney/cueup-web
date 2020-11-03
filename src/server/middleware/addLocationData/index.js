import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import SQL from 'sql-template-strings';
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

const getCountryResult = ({ db }) => async (countrySlug) => {
    const countryResult = await db.all(
        SQL`
                    SELECT *
                    FROM cities
                    WHERE countrySlug = ${countrySlug}
                    LIMIT 50
                `
    );
    if (countryResult.length) {
        // calculate based on cities
        const points = countryResult.map(({ lat, lng }) => ({ latitude: lat, longitude: lng }));
        const center = geolib.getCenterOfBounds(points);
        const bounds = geolib.getBounds(points);

        const coords = {
            lat: center.latitude,
            lng: center.longitude,
        };

        return {
            name: countryResult[0]?.country,
            city: null,
            country: countryResult[0]?.country,
            coords,
            radius: 25000, // set based on bounding box
            cities: countryResult,
            bounds,
            iso2: countryResult[0]?.iso2,
        };
    }
    return null;
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
        const { location } = req.params;

        const db = await getDB();

        let countryResult = await getCountryResult({ db })(location);

        if (countryResult) {
            res.locals.activeLocation = countryResult;
        } else {
            const result = await db.get(
                SQL`
                            SELECT *
                            FROM cities
                            WHERE citySlug = ${location}
                        `
            );
            if (result) {
                const {
                    population,
                    city,
                    country: countryName,
                    lat,
                    lng,
                    iso2,
                    countrySlug,
                    citySlug,
                } = result;
                const radius = (Math.sqrt(population) / Math.log2(population)) * 500; // set based on population

                countryResult = await getCountryResult({ db })(countrySlug);

                res.locals.activeLocation = {
                    name: city,
                    city,
                    citySlug,
                    country: countryName,
                    countrySlug,
                    countryResult,
                    coords: {
                        lat: parseFloat(lat),
                        lng: parseFloat(lng),
                    },
                    radius,
                    iso2,
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
        country: 'Denmark',
        citySlug: 'copenhagen',
        iso2: 'DK',
        lat: 55.6786,
        lng: 12.5635,
    },
    {
        id: 2,
        city: 'Bali',
        countrySlug: 'indonesia',
        country: 'Indonesia',
        citySlug: 'bali',
        iso2: 'ID',
        lat: -8.41719,
        lng: 115.1868,
    },
    {
        id: 3,
        city: 'Los Angeles',
        countrySlug: 'united-states',
        country: 'United States',
        citySlug: 'los-angeles',
        iso2: 'US',
        lat: 34.1139,
        lng: -118.4068,
    },
    {
        id: 4,
        city: 'Paris',
        countrySlug: 'france',
        country: 'France',
        citySlug: 'paris',
        iso2: 'FR',
        lat: 48.8667,
        lng: 2.3333,
    },
];

export const getLocationUrls = async () => {
    const db = await getDB();

    const cities = await db.all(
        SQL`
                SELECT citySlug, countrySlug
                FROM cities 
            `
    );
    const countries = await db.all(
        SQL`
                SELECT countrySlug, iso2
                FROM cities 
                GROUP BY iso2
            `
    );

    await db.close();

    return [...countries, ...cities].map(
        ({ citySlug, countrySlug }) => `/${citySlug || countrySlug}/book-dj`
    );
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
