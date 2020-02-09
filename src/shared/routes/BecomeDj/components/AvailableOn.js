import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import { TextAccent } from '../components/blocks/TextAccent';
import { GrayText, Header } from '../components/blocks/Text';
import addTranslate from '../../../components/higher-order/addTranslate';
import GracefullImage from '../../../components/GracefullImage';
import mobileIphone from '../../../assets/images/available-on/iphone_mobile.png';
import iphoneX from '../../../assets/images/available-on/iphone_x.png';
import android from '../../../assets/images/available-on/android.png';
import appStore from '../../../assets/images/available-on/app store.png';
import playStore from '../../../assets/images/available-on/googleplay.png';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 150px;
    padding-bottom: 200px;
    width: 100%;
    order: 8;
    @media only screen and (max-width: 685px) {
        padding: 80px 0;
    }
`;

const DesktopContainer = styled.div`
    padding-left: 100px;
    padding-right: 100px;
    display: flex;
    flex-direction: row;
    position: relative;
    @media only screen and (max-width: 685px) {
        display: none;
    }
`;

const DesktopTextContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
    position: relative;
`;

const DesktopImageContainer = styled.div`
    position: relative;
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin: 0 0 0 10px;
    img,
    > div {
        width: 323px;
        align-self: center;
    }
    .android {
        margin-top: 200px;
    }
    @media only screen and (max-width: 768px) {
        img {
            width: 250px;
            left: 50px;
            position: relative;
        }
        .android {
            margin-top: 200px;
        }
    }
`;

const MobileContainer = styled.div`
    display: flex;
    flex-direction: column;
    @media only screen and (min-width: 685px) {
        display: none;
    }
`;

const MobileTextContainer = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const MobileImageContainer = styled.div`
    padding-top: 50px;
    margin-right: -15px;
    display: flex;
    flex: 1;
    flex-direction: row;
`;

const StickyText = styled.div`
    position: sticky;
    top: 50vh;
    transform: translateY(-50%);
    margin-top: 50%;
    @media only screen and (min-width: 768px) {
        margin-top: 60%;
    }
`;

const AnimatedText = styled.div`
    height: 64px;
    transition: transform 500ms cubic-bezier(0.215, 0.61, 0.355, 1);
`;

const AnimatedTextWrapper = styled.div`
    height: 64px;
    overflow: hidden;
    margin-bottom: 18px;
`;

let lastScrollPosition = 0;

const AvailableOn = (props) => {
    const { translate, currentLanguage } = props;
    const textAnimation = useRef();
    const buttonAnimation = useRef();
    const androidRef = useRef();

    useEffect(() => {
        const observer = new IntersectionObserver(
            (records, observer) => {
                for (const record of records) {
                    if (record.intersectionRatio >= 0.5) {
                        lastScrollPosition = window.scrollY;
                        textAnimation.current.style.transform = 'translateY(-100%)';
                        buttonAnimation.current.style.transform = 'translateY(-100%)';
                    } else if (record.intersectionRatio < 0.5) {
                        textAnimation.current.style.transform = 'none';
                        buttonAnimation.current.style.transform = 'none';
                    }
                }
            },
            { threshold: [0, 0.5, 1], root: null, rootMargin: '0px' }
        );

        observer.observe(androidRef.current);

        return () => {
            observer.disconnect();
        };
    }, []);

    return (
        <Bg>
            <Container>
                <DesktopContainer>
                    <DesktopTextContainer>
                        <StickyText>
                            <TextAccent margin="0 0 15px 0" mobileTextAlign="left">
                                {translate('become-dj.available-on-iphone.desktop.available-on')}
                            </TextAccent>
                            <AnimatedTextWrapper>
                                <AnimatedText ref={textAnimation}>
                                    <Header
                                        style={{ marginBottom: '0px', lineHeight: '1em' }}
                                        left
                                        mobileTextAlign="left"
                                    >
                                        iPhone
                                    </Header>
                                    <Header
                                        style={{ marginBottom: '0px', lineHeight: '1em' }}
                                        left
                                        mobileTextAlign="left"
                                    >
                                        Android
                                    </Header>
                                </AnimatedText>
                            </AnimatedTextWrapper>
                            <GrayText mobileTextAlign="left">
                                Have all your gigs available at your fingertips, set your current
                                location, and respond quickly to the organizers.
                            </GrayText>
                            <div style={{ overflow: 'hidden', height: '50px', marginTop: '50px' }}>
                                <div
                                    style={{
                                        height: '50px',
                                        transition:
                                            'transform 500ms cubic-bezier(0.215, 0.610, 0.355, 1)',
                                    }}
                                    ref={buttonAnimation}
                                >
                                    <a
                                        href="https://apps.apple.com/us/app/cueup-gigs/id1458267647?mt=8"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={appStore}
                                            alt="app store"
                                            style={{
                                                height: '50px',
                                                display: 'block',
                                            }}
                                        />
                                    </a>
                                    <a
                                        href="https://play.google.com/store/apps/details?id=io.cueup.gigs&utm_source=website&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <img
                                            src={playStore}
                                            alt="app store"
                                            style={{
                                                height: '50px',
                                                display: 'block',
                                                marginTop: '1px',
                                            }}
                                        />
                                    </a>
                                </div>
                            </div>
                        </StickyText>
                    </DesktopTextContainer>
                    <DesktopImageContainer>
                        <GracefullImage
                            lazyload
                            animate
                            src={iphoneX}
                            className="iphone"
                            alt="dj gigs iPhone"
                        />

                        <div ref={androidRef} className="android">
                            <GracefullImage animate lazyload src={android} alt="dj gigs android" />
                        </div>
                    </DesktopImageContainer>
                </DesktopContainer>

                <MobileContainer>
                    <MobileTextContainer>
                        <TextAccent margin="0 0 15px 0">
                            {translate('become-dj.available-on-iphone.mobile.available-on')}
                        </TextAccent>
                        <Header style={{ textAlign: 'left' }}>iPhone & Android</Header>
                        <GrayText mobileTextAlign="left">
                            {translate('become-dj.available-on-iphone.mobile.content')}
                        </GrayText>
                    </MobileTextContainer>
                    <Row style={{ marginTop: '24px' }}>
                        <a
                            href="https://play.google.com/store/apps/details?id=io.cueup.gigs&utm_source=website&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GracefullImage
                                lazyload
                                src={playStore}
                                alt="Google Play store"
                                style={{
                                    height: '40px',
                                    marginRight: '12px',
                                }}
                            />
                        </a>
                        <a
                            href="https://apps.apple.com/us/app/cueup-gigs/id1458267647?mt=8"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            <GracefullImage
                                lazyload
                                src={appStore}
                                alt="Apple app store"
                                style={{
                                    height: '40px',
                                }}
                            />
                        </a>
                    </Row>
                    <MobileImageContainer>
                        <GracefullImage
                            src={mobileIphone}
                            animate
                            alt="Mobile"
                            style={{ height: '338px' }}
                        />
                    </MobileImageContainer>
                </MobileContainer>
            </Container>
        </Bg>
    );
};

export default addTranslate(AvailableOn);
