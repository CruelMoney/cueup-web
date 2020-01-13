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
import Highlights from './components/Highlights';
import Laptop from './components/Laptop';
import Integrations from './components/Integrations';
import GigsFeature from './components/GigsFeature';
import Payments from './components/Payments';
import CancelationFeature from './components/CancelationFeature';
import AvailableOn from './components/AvailableOn';
import JoinThousands from './components/JoinThousands';
import content from './content.json';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
`;

const Bg = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    position: fixed;
    top: 0;
    width: 100%;
    height: 200vh;
    z-index: -10;
`;

class Index extends Component {
    render() {
        const { translate, currentLanguage } = this.props;
        const title = translate('become-dj.title') + ' | Cueup';
        const thumb = Environment.CALLBACK_DOMAIN + (currentLanguage === 'da' ? thumbDa : thumbEn);

        return (
            <Wrapper className="me">
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
                <Highlights />
                <Laptop />
                <Integrations />
                <GigsFeature />
                <Payments />
                <CancelationFeature />
                <AvailableOn />
                <JoinThousands />
                <Bg />

                {/* <div style={{ height: '100vh' }} /> */}

                <Footer
                    noSkew
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./')}
                    firstLabel={translate('how-it-works')}
                    secondLabel={translate('arrange-event')}
                    title={translate('Wonder how it works?')}
                    subTitle={translate('See how it works, or arrange an event.')}
                />
            </Wrapper>
        );
    }
}

export default addTranslate(Index, content);
