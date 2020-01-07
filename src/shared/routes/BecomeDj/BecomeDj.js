import React, { Component } from 'react';
import { Helmet } from 'react-helmet-async';
import Footer from 'components/common/Footer';
import addTranslate from '../../components/higher-order/addTranslate';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import Hero from './components/Hero';
import content from './content.json';

class Index extends Component {
    render() {
        const { translate, currentLanguage } = this.props;
        const title = translate('become-dj.title') + ' | Cueup';
        const thumb = Environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);

        return (
            <div>
                <Helmet>
                    <title>{title}</title>
                    <meta property="og:title" content={title} />
                    <meta name="twitter:title" content={title} />

                    <meta property="og:image" content={thumb} />
                    <meta name="twitter:image" content={thumb} />
                    <meta
                        name="apple-itunes-app"
                        content="app-id=1458267647, app-argument=userProfile"
                    />
                </Helmet>
                <ScrollToTop />
                <Hero firstTo={translate('routes./')} />

                <div style={{ height: '100vh' }} />

                <Footer
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./')}
                    firstLabel={translate('how-it-works')}
                    secondLabel={translate('arrange-event')}
                    title={translate('Wonder how it works?')}
                    subTitle={translate('See how it works, or arrange an event.')}
                />
            </div>
        );
    }
}

export default addTranslate(Index, content);
