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
}

const addRedis = (app) => {
    const disableForLoggedIn = (req, res, next) => {
        // Use only cache if user not signed in
        const xToken = req.cookies['x-token'];
        res.use_express_redis_cache = !xToken;
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

    // special routes

    // this route might have a lot of subroutes with paramters of the name,
    // so to reduce the amount we cache, it's only for 1 day
    app.get('/dj-name-generator', cache.route({ expire: 60 * 60 * 24 })); // 1 day

    // otherwise cache forever for the given geo location
    app.get('*', setGeoCacheName, cache.route({ expire: -1 }));
};

const setGeoCacheName = (req, res, next) => {
    const countryCode = req.header('cf-ipcountry');
    res.express_redis_cache_name = req.originalUrl + (countryCode ? countryCode : '');
    next();
};

export default addRedis;
export { cache };
