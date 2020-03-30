import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import { withTranslation } from 'react-i18next';
import { appRoutes } from 'constants/locales/appRoutes';
import EmptyPage from '../../components/common/EmptyPage';
import Footer from '../../components/common/Footer';

class NotFound extends Component {
    render() {
        const { t } = this.props;
        const siteTitle = t('not-found-title');
        const siteDescription = t('not-found-description');

        return (
            <div className="not-found-screen">
                <Helmet>
                    <title>{siteTitle + ' | Cueup'}</title>
                    <body className="white-theme" />
                    <meta name="description" content={siteDescription} />

                    <meta property="og:title" content={siteTitle + ' | Cueup'} />
                    <meta property="og:description" content={siteDescription} />

                    <meta name="twitter:title" content={siteTitle + ' | Cueup'} />
                    <meta name="twitter:description" content={siteDescription} />
                </Helmet>

                <EmptyPage title={siteTitle} message={siteDescription} />
                <Footer
                    color={'#31DAFF'}
                    noSkew={true}
                    firstTo={t(appRoutes.home)}
                    secondTo={t(appRoutes.becomeDj)}
                    firstLabel={t('arrange-event')}
                    secondLabel={t('apply-to-become-dj')}
                    title={t('ready-to-get-started')}
                    subTitle={t('arrange-event-or-become-dj')}
                />
            </div>
        );
    }
}

export default withTranslation()(NotFound);
