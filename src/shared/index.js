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
import { OrganizationSeo } from 'components/SeoTags';
import useAlternativePages from 'components/hooks/useAlternativePages';
import defaultImage from './assets/images/default.png';
import ErrorHandling from './components/common/ErrorPage';

const LazyApp = loadable(() => import('./App'));

const Setup = ({ location }) => {
    const { environment } = useServerContext();
    const { t, i18n } = useTranslation();
    const languagePages = useAlternativePages();

    useAnalytics({
        disableTracking: environment.SETTING !== 'production',
    });

    useEffect(() => {
        Sentry.init({
            environment: environment.SETTING,
            enabled: environment.SETTING === 'production',
            dsn: 'https://800ac4dbef6c44bcb65af9fddad9f964@sentry.io/1490082',
            ignoreErrors: ['ResizeObserver', 'The network connection was lost'],
        });
    }, [environment.SETTING]);

    const thumb = defaultImage;
    const title = 'DJs for parties and events | Cueup';
    const description = t('site-description');

    const pageURL = environment.WEBSITE_URL + location.pathname;
    const thumbURL = environment.WEBSITE_URL + thumb;

    return (
        <ErrorHandling>
            <Helmet>
                <html lang={i18n.language} xmlLang={i18n.language} />
                <head itemScope itemType="http://schema.org/WebSite" />
                {environment.SETTING !== 'production' && <meta name="robots" content="noindex" />}

                <title>{title}</title>
                <meta itemProp="name" content={'Cueup'} />

                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content="dj, book, rent, copenhagen, cueup, music, events, party, wedding, birthday"
                />

                <meta property="og:url" content={pageURL} />
                <meta property="fb:app_id" content={environment.FACEBOOK_ID} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={thumbURL} />
                <meta property="og:type" content={'website'} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@@CueupDK" />
                <meta name="twitter:creator" content="@@CueupDK" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={thumbURL} />
                <meta name="twitter:url" content={pageURL} />

                <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
                <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
                <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
                <link rel="manifest" href="/site.webmanifest" />
                <link rel="mask-icon" href="/safari-pinned-tab.svg" color="#122b48" />
                <meta name="msapplication-TileColor" content="#122b48" />
                <meta name="theme-color" content="#ffffff" />

                {languagePages.map(({ active, url, code }) => (
                    <link
                        key={code}
                        href={url}
                        hrefLang={code}
                        rel={active ? 'canonical' : 'alternate'}
                        itemProp="url"
                    />
                ))}
            </Helmet>
            <OrganizationSeo />
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
