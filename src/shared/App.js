/* eslint-disable import/first */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactPixel from 'react-facebook-pixel';
import { useTranslation, useSSR } from 'react-i18next';

import * as gtag from './utils/analytics/autotrack';
import { Environment } from './constants/constants';
import Home from './routes/Home';
import About from './routes/About';
import NotFound from './routes/NotFound';
import defaultImage from './assets/images/default.png';
import defaultImageDa from './assets/images/default_da.png';
import ErrorHandling from './components/common/ErrorPage';
import Navigation from './components/Navigation';
import { getTranslatedURL } from './utils/HelperFunctions';
import { MobileMenuContext } from './components/MobileMenu';
import './css/style.css';

// check if route exists
const compareRoutes = (r1 = [], r2 = [], key = 'route') => {
    // eslint-disable-next-line security/detect-object-injection
    return r1.every((v, idx) => r2[idx] && v[key] === r2[idx][key]);
};

const App = ({ location }) => {
    const { t, i18n } = useTranslation();

    const [state, setState] = useState({
        mobileLinks: [],
    });

    useEffect(() => {
        // Setup custom analytics
        if (process.env.NODE_ENV !== 'development') {
            gtag.init();
            ReactPixel.init(Environment.PIXEL_ID);
        }
    }, []);

    useEffect(() => {
        if (process.env.NODE_ENV !== 'development') {
            setTimeout(() => {
                gtag.pageView(location.pathname);
                ReactPixel.pageView();
            }, 100);
        }
    }, [location.pathname]);

    const registerMobileLinks = useCallback(
        (routes, mobileLabel) => {
            setState((state) => {
                const { mobileLinks } = state;
                if (!compareRoutes(routes, mobileLinks)) {
                    let newLinks = mobileLinks.filter(
                        (l) => !routes.map((r) => r.route).includes(l.route)
                    );
                    newLinks = [...newLinks, ...routes];

                    return { ...state, mobileLinks: newLinks, mobileLabel };
                }
                return state;
            });
        },
        [setState]
    );

    const unregisterMobileLinks = useCallback(
        (routes) => {
            setState((state) => {
                const { mobileLinks } = state;
                const newLinks = mobileLinks.filter(
                    (l) => !routes.map((r) => r.route).includes(l.route)
                );
                if (!compareRoutes(mobileLinks, newLinks)) {
                    return {
                        ...state,
                        mobileLinks: newLinks,
                    };
                }
                return state;
            });
        },
        [setState]
    );

    const thumb = defaultImage;
    const title = t('Book DJs with ease') + ' | Cueup';
    const description = t('site-description');

    const pageURL = Environment.CALLBACK_DOMAIN + location.pathname;

    return (
        <ErrorHandling>
            <Helmet>
                <html lang={i18n.language} xmlLang={i18n.language} />
                {/* 
                    TODO
                    <link
                        rel="alternate"
                        href={altLangURL}
                        hrefLang={translate('hreflang.' + activeLanguage)}
                    /> */}

                <title>{title}</title>

                <meta name="description" content={description} />
                <meta
                    name="keywords"
                    content="dj, book, rent, copenhagen, cueup, music, events, party, wedding, birthday"
                />

                <meta property="og:url" content={pageURL} />
                <meta property="fb:app_id" content={Environment.FACEBOOK_ID} />
                <meta property="og:title" content={title} />
                <meta property="og:description" content={description} />
                <meta property="og:image" content={thumb} />

                <meta name="twitter:card" content="summary_large_image" />
                <meta name="twitter:site" content="@@CueupDK" />
                <meta name="twitter:creator" content="@@CueupDK" />
                <meta name="twitter:title" content={title} />
                <meta name="twitter:description" content={description} />
                <meta name="twitter:image" content={thumb} />
                <meta name="twitter:url" content={pageURL} />
            </Helmet>
            <MobileMenuContext.Provider
                value={{
                    routes: state.mobileLinks,
                    unregisterRoutes: unregisterMobileLinks,
                    registerRoutes: registerMobileLinks,
                    label: state.mobileLabel,
                }}
            >
                <RouteWrapper />
            </MobileMenuContext.Provider>
            <div id="popup-container" />
        </ErrorHandling>
    );
};

const RouteWrapper = memo(({ cssLocation }) => {
    const { t } = useTranslation();

    return (
        <>
            <Navigation />
            <div id="content" className={cssLocation}>
                <Switch>
                    <Route exact path={[t('routes./'), '/verifyEmail']} component={Home} />
                    <Route path={t('routes./about')} component={About} />
                    {/* <Route path={translate('routes./become-dj')} component={LazyBecomeDj} />
                    <Route path={translate('routes./how-it-works')} component={LazyHowItWorks} />
                    <Route path={translate('routes./signup')} component={Signup} /> */}

                    {/* <Route path={[translate('routes./user/:permalink')]} component={User} />
                    <Route path={'/complete-signup'} component={CompleteSignup} />
                    <Route path={translate('routes./faq')} component={Faq} />
                    <Route path={translate('routes./terms')} component={Terms} />
                    <Route
                        path={translate('routes./event') + '/:id/:hash'}
                        component={CueupEvent}
                    />
                    <Route path={translate('routes./gig') + '/:id'} component={Gig} />
                    <Route
                        path={translate('routes./book-dj') + '/:country/:city?'}
                        component={LocationLanding}
                    />
                    <Route path={translate('routes./book-dj')} component={LazyLocationsOverview} />
                    <Route path={translate('routes./blog')} component={Blog} />
                    <Route path={translate('routes./reset-password')} component={ResetPassword} /> */}

                    <Route component={NotFound} />
                </Switch>

                {/* 
                TODO add as portal
                <BottomPlayer /> 
                */}
            </div>
        </>
    );
});

export default withRouter(App);
