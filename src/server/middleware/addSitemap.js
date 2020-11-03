import fetch from 'node-fetch';
import posts from 'routes/Blog/posts.json';
import { getLocationUrls } from './addLocationData';

const expressSitemapXml = require('express-sitemap-xml');

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
    const urls = [
        '/',
        '/become-dj',
        '/signup',
        '/about',
        '/dj-name-generator',
        '/s/djs-near-me',
        '/login',
    ];
    return urls;
};

const getUrls = async () => {
    const userUrls = await getUserUrls();
    const locationUrls = await getLocationUrls();
    return [...getPublicUrls(), ...getBlogUrls(), ...locationUrls, ...userUrls];
};

const addSitemap = (app) => {
    app.use(expressSitemapXml(getUrls, process.env.WEBSITE_URL));
};

export default addSitemap;
