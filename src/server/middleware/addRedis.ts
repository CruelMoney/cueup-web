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
    console.log('adding redis');

    const disableForLoggedIn = (req, res, next) => {
        // Use only cache if user not signed in
        const xToken = req.cookies['x-token'];
        res.use_express_redis_cache = !xToken;
        next();
    };

    app.get('*', disableForLoggedIn);
    app.get('*', cache.route({ expire: -1 }));
    // expire after 60 seconds
    app.get('/user/*', cache.route({ expire: 60 }));
    app.get('/event/*', cache.route({ expire: 60 }));
    app.get('/gig/*', cache.route({ expire: 60 }));
};

export default addRedis;
export { cache };
