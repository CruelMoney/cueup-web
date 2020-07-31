import React from 'react';
import styled from 'styled-components';
import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { Body, TextAccent } from 'components/Text';
import { Col, Container } from 'components/Blocks';

import Footer from '../../../components/common/Footer';

import content from '../content.json';
import AnimatedDjCards from './AnimatedDjCards';
import DjSearch from './DJSearch';
import HowitworksSection from './HowItWorks';
import PaymentSection from './Payment';
import SocialProof from './SocialProof';
import FeatureCards from './FeatureCards';
import ComparisonSection from './ComparisonSection';

const Hero = () => {
    return (
        <HeroContainer>
            <Container>
                <LeftSide>
                    <Accent>1000+ successful events</Accent>
                    <Title>
                        Find DJs for parties <br />
                        and events
                    </Title>
                    <LandingBody>
                        Cueup is the easiest way for you to book a great DJ for your event. Start by
                        telling us about your event, and get prices from the DJs in your area.
                    </LandingBody>
                    <DjSearch />
                </LeftSide>
            </Container>
            <AnimatedDjCards />
            <MobileLayover />
        </HeroContainer>
    );
};

const Home = () => {
    const { translate } = useNamespaceContent(content, 'home');

    return (
        <div>
            <Hero />
            <HowitworksSection />
            <ComparisonSection />
            <PaymentSection />
            <FeatureCards />
            <SocialProof />
            <Footer
                noSkew
                bgColor="#FFFFFF"
                firstTo={'/book-dj'}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={'Find a DJ'}
                secondLabel={translate('apply-to-become-dj')}
                title={'Ready to start the party?'}
                subTitle={'Look for DJs now, or sign up as a DJ.'}
            />
        </div>
    );
};

const HeroContainer = styled.section`
    background: radial-gradient(114.62% 129.84% at 45.24% 67.36%, #122b48 0%, #000000 100%);
    min-height: 7.8em;
    display: flex;
    align-items: center;
    width: 100%;
    font-size: 6.94444vw;
    color: #fff;
    position: relative;
    @media only screen and (max-width: 1024px) {
        font-size: 13.02083vw;
        min-height: 6.5em;
    }
    @media only screen and (max-width: 480px) {
        min-height: 12em;
    }
`;

const MobileLayover = styled.div`
    background: radial-gradient(114.62% 129.84% at 45.24% 67.36%, #122b48 0%, #000000 100%);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    opacity: 0.8;
    display: none;

    @media only screen and (max-width: 480px) {
        display: block;
    }
`;

const Title = styled.h1`
    font-size: 0.42em;
    line-height: 1.3em;
    @media only screen and (max-width: 1024px) {
        font-size: 0.35em;
    }
    @media only screen and (max-width: 480px) {
        font-size: 0.3em;
    }
`;

const LandingBody = styled(Body)`
    font-size: 0.16em;
    line-height: 1.5em;
    color: #fff;
`;

const Accent = styled(TextAccent)`
    color: #00d1ff;
    font-size: 0.15em;
    margin-bottom: 0.75em;
`;

const LeftSide = styled(Col)`
    max-width: 50%;
    font-size: 120px;
    z-index: 2;
    position: relative;
    @media only screen and (max-width: 1024px) {
        font-size: 100px;
    }
    @media only screen and (max-width: 480px) {
        max-width: 100%;
        padding-top: 1.2em;
        padding-bottom: 0.5em;
    }
`;

export default Home;
