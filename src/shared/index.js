/* eslint-disable import/first */
import React, { useEffect } from 'react';
import { withRouter, Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import * as Sentry from '@sentry/react';
import loadable from '@loadable/component';
import { useServerContext } from 'components/hooks/useServerContext.tsx';

import { appRoutes } from 'constants/locales/appRoutes';
import LazyDjNameGenerator from 'routes/DjNameGenerator';
import { useAnalytics } from 'utils/analytics';
import defaultImage from './assets/images/default.png';
import ErrorHandling from './components/common/ErrorPage';

const LazyApp = loadable(() => import('./App'));

const Setup = ({ location }) => {
    const { environment } = useServerContext();
    const { t, i18n } = useTranslation();
    useAnalytics();

    useEffect(() => {
        Sentry.init({
            environment: environment.SETTING,
            enabled: environment.SETTING === 'production',
            dsn: 'https://800ac4dbef6c44bcb65af9fddad9f964@sentry.io/1490082',
        });
    }, [environment.SETTING]);

    const thumb = defaultImage;
    const title = t('Book DJs with ease') + ' | Cueup';
    const description = t('site-description');

    const pageURL = environment.WEBSITE_URL + location.pathname;
    return (
        <ErrorHandling>
            <Helmet>
                <html lang={i18n.language} xmlLang={i18n.language} />

                {environment.SETTING !== 'production' && <meta name="robots" content="noindex" />}

                <title>{title}</title>

                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content="dj, book, rent, copenhagen, cueup, music, events, party, wedding, birthday"
                />

                <meta property="og:url" content={pageURL} />
                <meta property="fb:app_id" content={environment.FACEBOOK_ID} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={thumb} />
                <meta property="og:type" content={'website'} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@@CueupDK" />
                <meta name="twitter:creator" content="@@CueupDK" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={thumb} />
                <meta name="twitter:url" content={pageURL} />
            </Helmet>

            <Switch>
                {/* Here we can add routes that are seperate from the rest of the site */}
                <Route path={t(appRoutes.djNameGenerator)} component={LazyDjNameGenerator} />
                <Route component={LazyApp} />
            </Switch>
        </ErrorHandling>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default withRouter(Setup);
