/* eslint-disable import/first */
import React, { useEffect } from 'react';
import { Route, Switch, useRouteMatch } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { appRoutes, userRoutes } from 'constants/locales/appRoutes.ts';
import LazySignup from 'routes/Signup';
import LazyUser from 'routes/User';
import LazyCompleteSignup from 'routes/CompleteSignup';
import LazyTerms from 'routes/Terms';
import LazyEvent from 'routes/Event';
import LazySettings from 'routes/Settings';
import LazyGigs from 'routes/Gigs';
import LazyEvents from 'routes/Events';
import ResetPassword from 'routes/ResetPassword';
import LazyLocation, { LazyCountriesOverview, LazySearch } from 'routes/BookDJ';
import LazyGig from 'routes/Gig';
import LazySideBarChat from 'components/SidebarChat';
import LazyGetProfessional from 'routes/GetProfessional';
import { RequestFormPopup } from 'components/common/RequestForm';
import { loadSupportChat } from 'utils/supportChat';

import LazyFaq from 'routes/Faq';
import LazyBecomeDj from 'routes/BecomeDj';
import LazyBlog from 'routes/Blog';
import LazyDjsNearMe from 'routes/DJsNearMe';
import Login from 'routes/Login';
import { MediaContextProvider } from 'components/MediaContext';
import Jobs from 'routes/Jobs';
import { ProvideAppState, useAppState } from './components/hooks/useAppState';
import Home from './routes/Home';
import About from './routes/About';
import NotFound from './routes/NotFound';
import { ProvideMobileMenu } from './components/Navigation/MobileMenu';
import BottomPlayer from './routes/User/routes/Sounds/BottomPlayer';

import './css/style.css';

const App = () => {
    useEffect(() => {
        setTimeout(loadSupportChat, 8000);
    }, []);

    return (
        <MediaContextProvider>
            <ProvideAppState>
                <ProvideMobileMenu>
                    <RouteWrapper />
                </ProvideMobileMenu>
                <div id="popup-container" />
            </ProvideAppState>
        </MediaContextProvider>
    );
};

const RouteWrapper = () => {
    const { t } = useTranslation();
    const { showBottomPlayer, showSideBarChat } = useAppState();

    return (
        <>
            <div id="content">
                <Switch>
                    <Route
                        exact
                        path={[t(appRoutes.home), '/verifyEmail', '/connectInstagram']}
                        component={Home}
                    />
                    <Route path={t(appRoutes.about)} component={About} />
                    <Route path={t(appRoutes.jobs)} component={Jobs} />
                    <Route path={t(appRoutes.faq)} component={LazyFaq} />
                    <Route path={t(appRoutes.becomeDj)} component={LazyBecomeDj} />
                    <Route path={t(appRoutes.blog)} component={LazyBlog} />

                    <Route path={t(appRoutes.signUp)} component={LazySignup} />

                    <Route path={t(appRoutes.userSettings)} component={LazySettings} />
                    <Route path={t(appRoutes.userEvents)} component={LazyEvents} />
                    <Route path={t(appRoutes.userGigs)} component={LazyGigs} />

                    <Route path={t(appRoutes.user) + '/:permalink?'} component={LazyUser} />
                    <Route path={'/:permalink/book'} component={LazyUser} />
                    <Route path={t(appRoutes.completeSignup)} component={LazyCompleteSignup} />
                    <Route path={t(appRoutes.terms)} component={LazyTerms} />
                    <Route path={t(appRoutes.event) + '/:id/:hash'} component={LazyEvent} />
                    <Route
                        path={[t(appRoutes.gig) + '/:id', t(appRoutes.opportunity) + '/:id']}
                        component={LazyGig}
                    />
                    <Route path={t(appRoutes.bookDj)} component={LazyLocation} />
                    <Route path={t(appRoutes.bookDjOverview)} component={LazyCountriesOverview} />
                    <Route path={t(appRoutes.djsNearMe)} component={LazyDjsNearMe} />
                    <Route path={t(appRoutes.search)} component={LazySearch} />
                    <Route path={t(appRoutes.resetPassword)} component={ResetPassword} />
                    <Route path={'/book-dj'} exact component={RequestFormPopup} />
                    <Route path={t(appRoutes.login)} component={Login} />

                    <Route component={NotFound} />
                </Switch>
                {showBottomPlayer && <BottomPlayer />}

                {showSideBarChat && <LazySideBarChat />}

                <Route path={'*/get-pro'} exact component={LazyGetProfessional} />
            </div>
        </>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default App;
