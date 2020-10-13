import { URL } from 'url';
import redis from 'express-redis-cache';

//  REDIS_URL=redis://lolipop:SOME_PASSWORD@dokku-redis-lolipop:6379
const REDIS_URL = process.env.REDIS_URL;
const options = {
    host: '',
    port: '',
    auth_pass: '',
};
if (REDIS_URL) {
    const redisUrl = new URL(REDIS_URL);
    options.host = redisUrl.hostname;
    options.port = redisUrl.port;
    options.auth_pass = redisUrl.password;
}
const cache = redis(options);

if (process.env.SETTING === 'development') {
    cache.on('message', console.log);
    cache.on('error', console.log);
}

const addRedis = (app) => {
    const disableForLoggedIn = (req, res, next) => {
        // Use only cache if user not signed in
        const xToken = req.cookies['x-token'];
        // And if no query params
        const containsQuery = !!Object.keys(req.query).length;

        res.use_express_redis_cache = !xToken && !containsQuery;
        next();
    };

    const disable = (_req, res, next) => {
        res.use_express_redis_cache = false;
        next();
    };

    app.get('*', disableForLoggedIn);

    // disabled routes
    app.get(['/event', '/event*'], disable);
    app.get(['/gig', '/gig*'], disable);
    app.get(['/user', '/user*'], disable);

    app.get('*', setGeoCacheName);

    // cache forever routes
    app.get(
        ['/', '/blog', '/blog*', '/dj-name-generator', '/become-dj', '/signup'],
        cache.route({ expire: -1 })
    );

    // cache 60 seconds routes
    app.get(['/*/book-dj'], cache.route({ expire: 60 }));
};

const setGeoCacheName = (req, res, next) => {
    const countryCode = req.header('cf-ipcountry');
    res.express_redis_cache_name =
        req.originalUrl + (countryCode ? countryCode : '') + (req.useragent.isBot ? ':bot' : '');
    next();
};

export default addRedis;
export { cache };
