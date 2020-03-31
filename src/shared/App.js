/* eslint-disable import/first */
import React, { useState, useEffect, useCallback } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactPixel from 'react-facebook-pixel';
import { useTranslation } from 'react-i18next';
import { useRouteMatch } from 'react-router';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import LazySignup from 'routes/Signup';
import LazyUser from 'routes/User';
import LazyCompleteSignup from 'routes/CompleteSignup';
import LazyTerms from 'routes/Terms';
import LazyEvent from 'routes/Event';
import ResetPassword from 'routes/ResetPassword';
import LazyLocation, { LazyLocationsOverview } from 'routes/Location';
import LazyGig from 'routes/Gig';

import LazyFaq from 'routes/Faq';
import LazyBecomeDj from 'routes/BecomeDj';
import LazyBlog from 'routes/Blog';
import LazyHowItWorks from 'routes/HowItWorks';
import * as gtag from './utils/analytics/autotrack';
import { Environment } from './constants/constants';
import Home from './routes/Home';
import About from './routes/About';
import NotFound from './routes/NotFound';
import defaultImage from './assets/images/default.png';
import ErrorHandling from './components/common/ErrorPage';
import Navigation from './components/Navigation';
import { MobileMenuContext } from './components/MobileMenu';
import './css/style.css';

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
                <Navigation />
                <RouteWrapper />
            </MobileMenuContext.Provider>
            <div id="popup-container" />
        </ErrorHandling>
    );
};

const RouteWrapper = () => {
    const { t } = useTranslation();
    return (
        <div id="content">
            <Switch>
                <Route exact path={[t(appRoutes.home), '/verifyEmail']} component={Home} />
                <Route path={t(appRoutes.about)} component={About} />
                <Route path={t(appRoutes.faq)} component={LazyFaq} />
                <Route path={t(appRoutes.becomeDj)} component={LazyBecomeDj} />
                <Route path={t(appRoutes.blog)} component={LazyBlog} />

                <Route path={t(appRoutes.howItWorks)} component={LazyHowItWorks} />
                <Route path={t(appRoutes.signUp)} component={LazySignup} />

                <Route path={t(appRoutes.user) + '/:permalink'} component={LazyUser} />
                <Route path={t(appRoutes.completeSignup)} component={LazyCompleteSignup} />
                <Route path={t(appRoutes.terms)} component={LazyTerms} />
                <Route path={t(appRoutes.event) + '/:id/:hash'} component={LazyEvent} />
                <Route path={t(appRoutes.gig) + '/:id'} component={LazyGig} />
                <Route path={t(appRoutes.bookDj)} component={LazyLocation} />
                <Route path={t(appRoutes.bookDjOverview)} component={LazyLocationsOverview} />

                <Route path={t(appRoutes.resetPassword)} component={ResetPassword} />

                <Route component={NotFound} />
            </Switch>
            {/* 
                TODO add as portal
                <BottomPlayer /> 
                */}
        </div>
    );
};

export default withRouter(App);
