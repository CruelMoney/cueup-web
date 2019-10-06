/* eslint-disable import/first */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import ReactPixel from 'react-facebook-pixel';
import { useTranslation } from 'react-i18next';

import { init as analytics } from './utils/analytics/autotrack';
import { Environment } from './constants/constants';

import Home from './routes/Home';
import About from './routes/About';
import CueupEvent from './routes/Event';
import Gig from './routes/Gig';
import HowItWorks from './routes/HowItWorks';
import Signup from './routes/Signup';
import User from './routes/User';
import Faq from './routes/Faq';
import Terms from './routes/Terms';
import LocationLanding from './routes/Location';
import NotFound from './routes/NotFound';
import defaultImage from './assets/images/default.png';
import defaultImageDa from './assets/images/default_da.png';
import Blog from './routes/Blog';
import ErrorHandling from './components/common/ErrorPage';
import Navigation from './components/Navigation';
import ResetPassword from './routes/ResetPassword';
import { MobileMenuContext } from './components/MobileMenu';
import BottomPlayer from './routes/User/routes/Sounds/BottomPlayer';
import './css/style.css';

const App = () => {
    const [state, setState] = useState({
        mobileLinks: [],
    });

    useEffect(() => {
        // Setup custom analytics
        if (process.env.NODE_ENV !== 'development') {
            analytics();
            ReactPixel.init(Environment.PIXEL_ID);
            ReactPixel.pageView();
        }
    }, []);

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

    // if (!!redirect && location.pathname !== redirect && !redirected) {
    //     redirected = true;
    //     return <Redirect to={redirect} />;
    // }

    // const thumb =
    //     Environment.CALLBACK_DOMAIN + defaultImage;
    // const title = translate('Book DJs with ease') + ' | Cueup';
    // const description = translate('site-description');
    // const urlArr = url.split('/');
    // let cssLocation = urlArr[1] === 'dk' ? urlArr[2] : urlArr[1];
    // cssLocation = `location_${cssLocation || ''}`;
    // const pageURL = Environment.CALLBACK_DOMAIN + location.pathname;
    // const altLangURL =
    //     Environment.CALLBACK_DOMAIN +
    //     getTranslatedURL(url, translate('code.' + activeLanguage), translate);

    return (
        <ErrorHandling>
            <div>
                <Helmet>
                    {/* <link
                        rel="alternate"
                        href={altLangURL}
                        hrefLang={translate('hreflang.' + activeLanguage)}
                    />

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
                    <meta name="twitter:url" content={pageURL} /> */}
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
            </div>
        </ErrorHandling>
    );
};

const RouteWrapper = () => {
    const { t } = useTranslation();

    return (
        <>
            <Navigation />
            <div id="content">
                <Switch>
                    <Route exact path={['/', '/verifyEmail']} component={Home} />
                    <Route path={t('/route.about')} component={About} />
                    <Route path={'/user/:permalink'} component={User} />
                    <Route path={'/how-it-works'} component={HowItWorks} />
                    <Route path={'/signup'} component={Signup} />
                    <Route path={'/faq'} component={Faq} />
                    <Route path={'/terms'} component={Terms} />
                    <Route path={'/event/:id/:hash'} component={CueupEvent} />
                    <Route path={'/gig/:id'} component={Gig} />
                    <Route path={'/book-dj/:country/:city?'} component={LocationLanding} />
                    <Route path={'/blog'} component={Blog} />
                    <Route path={'/reset-password'} component={ResetPassword} />

                    <Route component={NotFound} />
                </Switch>

                <BottomPlayer />
            </div>
        </>
    );
};

const compareRoutes = (r1 = [], r2 = [], key = 'route') => {
    return r1.every((v, idx) => r2[idx] && v[key] === r2[idx][key]);
};

export default App;
