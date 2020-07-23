import React, { useRef } from 'react';
import { withTranslation } from 'react-i18next';
import styled from 'styled-components';
import SuperEllipse, { Preset } from 'react-superellipse';
import { appRoutes } from 'constants/locales/appRoutes';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { Body } from 'components/Text';
import { Col, SmartButton } from 'components/Blocks';
import Footer from '../../../components/common/Footer';

import content from '../content.json';
import AnimatedDjCards from './AnimatedDjCards';

const DjSearch = () => {
    return (
        <SuperEllipse
            r1={Preset.iOS.r1}
            r2={Preset.iOS.r2}
            style={{
                width: '100%',
                height: '0.6em',
                background: '#fff',
                marginTop: '0.3em',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '0.1em',
            }}
        >
            <SuperEllipse
                perEllipse
                r1={Preset.iOS.r1}
                r2={Preset.iOS.r2}
                style={{ marginLeft: 'auto' }}
            >
                <SmartButton primary style={{ fontSize: '0.14em', height: '3em', minWidth: '8em' }}>
                    Find DJs
                </SmartButton>
            </SuperEllipse>
        </SuperEllipse>
    );
};

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
                        Cueup is the easiest way for you to get a great DJ for your event. Tell us
                        about your event below, and check out 1000s of qualified DJs.
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
            <Footer
                noSkew
                bgColor="#FFFFFF"
                firstTo={translate(appRoutes.signUp)}
                secondTo={translate(appRoutes.howItWorks)}
                firstLabel={translate('apply-to-become-dj')}
                secondLabel={translate('how-it-works')}
                title={translate('home:footer.first')}
                subTitle={translate('home:footer.second')}
            />
        </div>
    );
};

const HeroContainer = styled.section`
    background: radial-gradient(114.62% 129.84% at 45.24% 67.36%, #122b48 0%, #000000 100%);
    min-height: 7.8em;
    overflow: hidden;
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

const Container = styled.div`
    margin: 0 auto;
    max-width: 1260px;
    padding: 0 30px;
    width: 100%;
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

const Accent = styled.p`
    color: #00d1ff;
    font-weight: 700;
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

export default withTranslation()(Home);
