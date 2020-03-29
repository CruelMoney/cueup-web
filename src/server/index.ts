// import React from 'react';
import path from 'path';
import express, { Application } from 'express';
import cors from 'cors';
import chalk from 'chalk';
import manifestHelpers from 'express-manifest-helpers';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import addApollo from 'middleware/addApollo';
import addLoadableExtractor from 'middleware/addLoadableExtractor';
import addRedis, { cache } from 'middleware/addRedis';
import addSitemap from 'middleware/addSitemap';
import paths from '../../config/paths';
// import { configureStore } from '../shared/store';
import errorHandler from './middleware/errorHandler';
import serverRenderer from './middleware/serverRenderer';
import addStore from './middleware/addStore';
import webhookVerification from './middleware/webhookVerification';
import { i18nextXhr, refreshTranslations } from './middleware/i18n';

require('dotenv').config();

const app: Application = express();
const isDevelopment = process.env.NODE_ENV === 'development';

// Use Nginx or Apache to serve static assets in production or remove the if() around the following
// lines to use the express.static middleware to serve assets for production (not recommended!)
app.use('/', express.static(path.join(paths.clientBuild), { maxAge: '365 days' }));

app.use(cors());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/locales/refresh', webhookVerification, refreshTranslations);

// It's probably a good idea to serve these static assets with Nginx or Apache as well:
app.get('/locales/:locale/:ns.json', i18nextXhr);

const manifestPath = path.join(paths.clientBuild, paths.publicPath);

app.use(
    manifestHelpers({
        manifestPath: `${manifestPath}/manifest.json`,
    })
);

!isDevelopment && addRedis(app);
app.use(addApollo);
app.use(addStore);
app.use(addLoadableExtractor);

addSitemap(app);

app.use(serverRenderer());

app.use(errorHandler);

app.listen(process.env.PORT || 8500, () => {
    // invalidate redis
    cache.del('*', (error: any, count: Number) => {
        if (error) {
            console.log(chalk.red('Cache could not be flushed'));
        } else {
            console.log(chalk.blue('Cache flushed: ' + count));
        }
    });

    console.log(
        `[${new Date().toISOString()}]`,
        chalk.green(`App is running: http://localhost:${process.env.PORT || 8500}`)
    );
});

export default app;
