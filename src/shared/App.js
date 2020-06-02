/* eslint-disable import/first */
import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import { ProvideAppState, useAppState } from './components/hooks/useAppState';
import Home from './routes/Home';
import About from './routes/About';
import NotFound from './routes/NotFound';
import Navigation from './components/Navigation';
import { ProvideMobileMenu } from './components/Navigation/MobileMenu';
import BottomPlayer from './routes/User/routes/Sounds/BottomPlayer';

import './css/style.css';

const App = () => {
    return (
        <ProvideAppState>
            <ProvideMobileMenu>
                <Navigation />
                <RouteWrapper />
            </ProvideMobileMenu>
            <div id="popup-container" />
        </ProvideAppState>
    );
};

const RouteWrapper = () => {
    const { t } = useTranslation();
    const { showBottomPlayer } = useAppState();

    return (
        <div id="content">
            <Switch>
                <Route
                    exact
                    path={[t(appRoutes.home), '/verifyEmail', '/connectInstagram']}
                    component={Home}
                />
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
            {showBottomPlayer && <BottomPlayer />}
        </div>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default App;
