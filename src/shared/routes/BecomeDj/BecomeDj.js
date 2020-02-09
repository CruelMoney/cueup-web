import React, { Component } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
import { findByLabelText } from '@testing-library/react';
import Footer from 'components/common/Footer';
import addTranslate from '../../components/higher-order/addTranslate';
import thumbEn from '../../assets/images/signup.png';
import thumbDa from '../../assets/images/signup_da.png';
import { Environment } from '../../constants/constants';
import ScrollToTop from '../../components/common/ScrollToTop';
import Hero from './components/Hero';
import HighlightsLaptop from './components/HighlightsLaptop';
import Integrations from './components/Integrations';
import GettingGigs from './components/GettingGigs';
import Payments from './components/Payments';
import CancelationPolicy from './components/CancelationPolicy';
import AvailableOn from './components/AvailableOn';
import JoinThousands from './components/JoinThousands';
import content from './content.json';

const Bg = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
`;

class Index extends Component {
    render() {
        const { translate, currentLanguage } = this.props;
        const title = translate('become-dj.title') + ' | Cueup';
        const thumb = Environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);
        const themeColor = '#00d1ff';
        return (
            <>
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
                <Bg>
                    <Hero firstTo={translate('routes./')} />
                    <HighlightsLaptop />
                    <Integrations />
                </Bg>
                <GettingGigs />
                <Payments />
                <CancelationPolicy />
                <AvailableOn />
                <JoinThousands />

                {/* <div style={{ height: '100vh' }} /> */}

                <Footer
                    color={themeColor}
                    firstTo={translate('routes./signup')}
                    secondTo={translate('routes./blog')}
                    firstLabel={translate('Sign up')}
                    secondLabel={translate('Blog')}
                    title={translate('Ready to get started?')}
                    subTitle={translate('Apply to become DJ now, or read our blog.')}
                />
            </>
        );
    }
}

export default addTranslate(Index, content);
