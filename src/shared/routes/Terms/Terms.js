import React from 'react';
import { Switch, Route } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router-dom';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import Menu from 'components/Navigation';
import ScrollToTop from '../../components/common/ScrollToTop';
import Terms from './components/Terms';
import Agreements from './routes/Agreements';
import Privacy from './routes/Privacy';
import CookiePolicy from './routes/CookiePolicy/components/Cookie';

const Index = (props) => {
    const { translate } = useTranslate();
    const title = translate('Terms & Privacy') + ' | Cueup';

    return (
        <>
            <Helmet>
                <title>{title}</title>
                <meta property="og:title" content={title} />
                <meta name="twitter:title" content={title} />
            </Helmet>
            <Menu dark relative />
            <Terms {...props}>
                <ScrollToTop />
                <Switch>
                    <Route path={translate(appRoutes.termsAgreements)} component={Agreements} />
                    <Route path={translate(appRoutes.termsPrivacy)} component={Privacy} />
                    <Route path={translate(appRoutes.termsCookie)} component={CookiePolicy} />
                    <Redirect
                        exact
                        from={translate(appRoutes.terms)}
                        to={translate(appRoutes.termsAgreements)}
                    />
                </Switch>
            </Terms>
        </>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default Index;
