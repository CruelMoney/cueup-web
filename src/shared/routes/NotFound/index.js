import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
import { Helmet } from 'react-helmet-async';
import EmptyPage from '../../components/common/EmptyPage';
import Footer from '../../components/common/Footer';

class NotFound extends Component {
    componentDidMount() {
        document.body.classList.add('not-found');
    }

    componentWillUnmount() {
        document.body.classList.remove('not-found');
    }

    render() {
        const { translate } = this.props;
        const siteTitle = translate('not-found-title');
        const siteDescription = translate('not-found-description');

        return (
            <div className="not-found-screen">
                <Helmet>
                    <title>{siteTitle + ' | Cueup'}</title>
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
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./signup')}
                    firstLabel={translate('arrange-event')}
                    secondLabel={translate('apply-to-become-dj')}
                    title={translate('ready-to-get-started')}
                    subTitle={translate('arrange-event-or-become-dj')}
                />
            </div>
        );
    }
}

export default localize(NotFound, 'locale');
