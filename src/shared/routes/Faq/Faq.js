import React, { Component } from 'react';
import { Switch, Route, Redirect } from 'react-router';
import { Helmet } from 'react-helmet-async';
import { withTranslation } from 'react-i18next';
import { appRoutes } from 'constants/locales/appRoutes.ts';
import ScrollToTop from '../../components/common/ScrollToTop';
import Faq from './components/Faq';
import Dj from './routes/DJ';
import Organizer from './routes/Organizer';

class Index extends Component {
    render() {
        const { match, t } = this.props;
        const title = 'FAQ | Cueup';

        return (
            <Faq {...this.props}>
                <Helmet>
                    <body className="white-theme" />
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />
                </Helmet>
                <ScrollToTop />
                <Switch>
                    <Route
                        path={t(appRoutes.faqDj)}
                        render={(props) => <Dj {...props} translate={t} />}
                    />
                    <Route
                        path={t(appRoutes.faqOrganizer)}
                        render={(props) => <Organizer {...props} translate={t} />}
                    />
                    <Redirect exact from={`${match.url}`} to={t(appRoutes.faqDj)} />
                </Switch>
            </Faq>
        );
    }
}

export default withTranslation()(Index);
