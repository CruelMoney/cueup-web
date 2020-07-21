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
                height: '72px',
                background: '#fff',
                marginTop: '0.3em',
                display: 'flex',
                alignItems: 'center',
                flexDirection: 'row',
                padding: '13px',
            }}
        >
            <SuperEllipse
                perEllipse
                r1={Preset.iOS.r1}
                r2={Preset.iOS.r2}
                style={{ marginLeft: 'auto' }}
            >
                <SmartButton primary style={{ height: '50px' }}>
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
                <Col style={{ maxWidth: '50%' }}>
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
                </Col>
            </Container>
            <AnimatedDjCards />
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
    height: 7.8em;
    padding: 2.31em 0 0;
    overflow: hidden;
    width: 100%;
    font-size: 6.94444vw;
    color: #fff;
    position: relative;
`;

const Container = styled.div`
    margin: 0 auto;
    max-width: 1260px;
    padding: 0 30px;
    width: 100%;
`;

const Title = styled.h1`
    font-size: 0.42em;
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

export default withTranslation()(Home);
