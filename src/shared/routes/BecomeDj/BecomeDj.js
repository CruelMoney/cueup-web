import React, { useEffect } from 'react';
import styled from 'styled-components';
import { Helmet } from 'react-helmet-async';
// import { findByLabelText } from '@testing-library/react';
import Footer from 'components/common/Footer';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { appRoutes } from 'constants/locales/appRoutes';
import { useServerContext } from 'components/hooks/useServerContext';
import ScrollToTop from '../../components/common/ScrollToTop';
import Signup from '../Signup';
import Hero from './components/Hero';
import JoinThousands from './components/JoinThousands';
import HighlightsLaptop from './components/HighlightsLaptop';
import thumbSrc from './assets/become-dj.png';
import Integrations from './components/Integrations';
import GettingGigs from './components/GettingGigs';
import Payments from './components/Payments';
import CancelationPolicy from './components/CancelationPolicy';
import AvailableOn from './components/AvailableOn';
import content from './content.json';
import Mixtapes from './components/Mixtapes';

const Bg = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
`;

const Index = () => {
    const { environment } = useServerContext();
    const { translate } = useNamespaceContent(content, 'become-dj');

    const title = translate('become-dj:title') + ' | Cueup';
    const thumb = environment.CALLBACK_DOMAIN + thumbSrc;
    const themeColor = '#00d1ff';

    // preload signup page
    useEffect(() => {
        Signup.preload();
    }, []);

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
                <Hero
                    firstTo={translate(appRoutes.signUp)}
                    blueAccent="2020 UPDATE"
                    title={'The only profile\n a DJ needs.'}
                    subtitle="As a DJ you don't want to waste time promoting yourself when you could be out playing. Cueup makes it simple to get booked."
                    heroButtonText="Apply to become DJ"
                />
                <HighlightsLaptop
                    text1Row1="Get"
                    text1Row2="Gigs"
                    text2Row1="Upload"
                    text2Row2="Mixtapes"
                    text3Row1="Showcase"
                    text3Row2="Photos"
                    text4Row1="Add"
                    text4Row2="Reviews"
                />
                <Integrations />
            </Bg>
            <GettingGigs />

            <CancelationPolicy />
            <Payments />
            <Mixtapes />

            <AvailableOn />
            <JoinThousands
                title={'Be part of a \n global community'}
                description={
                    'Cueup is a growing community of DJs. Joining Cueup also means you become part of a group of the most talented and passionate DJs around the world.'
                }
                to={translate(appRoutes.signUp)}
                label={translate('become-dj:join-thousands-of-DJs.apply-to-become-DJ')}
            />

            {/* <div style={{ height: '100vh' }} /> */}

            <Footer
                bgColor="#fff"
                color={themeColor}
                firstTo={translate(appRoutes.signUp)}
                secondTo={translate(appRoutes.blog)}
                firstLabel={translate('Sign up')}
                secondLabel={translate('Blog')}
                title={translate('Ready to get started?')}
                subTitle={translate('Apply to become DJ now, or read our blog.')}
            />
        </>
    );
};

// eslint-disable-next-line import/no-unused-modules
export default Index;
