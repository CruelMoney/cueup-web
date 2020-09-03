import fetch from 'node-fetch';
import posts from 'routes/Blog/posts.json';
import { countries } from 'routes/Location/locations';

const expressSitemapXml = require('express-sitemap-xml');

const getLocationUrls = () => {
    const urls = [];
    Object.entries(countries).map(([countrySlug, { cities }]) =>
        cities.forEach((city) => urls.push(`/book-dj/${countrySlug}/${city.slug}`))
    );
    return urls;
};

const getUserUrls = async () => {
    try {
        const data = await fetch(process.env.REACT_APP_CUEUP_GQL_DOMAIN + '/userurls');
        return await data.json();
    } catch (error) {
        console.log({ error });
        return [];
    }
};

const getBlogUrls = () => {
    const urls = ['/blog', ...posts.map((p) => `/blog/${p.slug}`)];
    return urls;
};

const getPublicUrls = () => {
    const urls = ['/', '/how-it-works', '/become-dj', '/signup', '/about', '/dj-name-generator'];
    return urls;
};

const getUrls = async () => {
    const userUrls = await getUserUrls();
    return [...getPublicUrls(), ...getBlogUrls(), ...getLocationUrls(), ...userUrls];
};

const addSitemap = (app) => {
    app.use(expressSitemapXml(getUrls, process.env.WEBSITE_URL));
};

export default addSitemap;
