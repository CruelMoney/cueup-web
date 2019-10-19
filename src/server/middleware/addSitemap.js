import { countries } from 'routes/Location/locations';

const expressSitemapXml = require('express-sitemap-xml');

const getLocationUrls = () => {
    const urls = [];
    Object.entries(countries).map(([countrySlug, { cities }]) =>
        cities.forEach((city) => urls.push(`/book-dj/${countrySlug}/${city.slug}`))
    );
    return urls;
};

const getBlogUrls = () => {
    const urls = ['/blog', '/blog/bliv-dj-i-koebenhavn'];
    return urls;
};

const getPublicUrls = () => {
    const urls = ['/', '/signup', '/about', '/faq/dj', '/faq/organizer'];

    return urls;
};

const getUrls = async () => {
    return [...getPublicUrls(), ...getBlogUrls(), ...getLocationUrls()];
};

const addSitemap = (app) => {
    app.use(expressSitemapXml(getUrls, process.env.WEBSITE_URL));
};

export default addSitemap;
