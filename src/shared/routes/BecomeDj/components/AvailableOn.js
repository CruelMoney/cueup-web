import React, { useRef, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import { TextAccent } from '../components/blocks/TextAccent';
import { BlueTitle } from '../components/blocks/Title';
import { GrayText, Header } from '../components/blocks/Text';
import addTranslate from '../../../components/higher-order/addTranslate';
import GracefullImage from '../../../components/GracefullImage';
import mobileLeft from '../../../assets/images/available-on/1_front.png';
import mobileRightTop from '../../../assets/images/available-on/4.png';
import mobileRightBottom from '../../../assets/images/available-on/4 copy.png';
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
`;

const DesktopContainer = styled.div`
    padding-left: 100px;
    padding-right: 100px;
    display: flex;
    flex-direction: row;
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
    display: flex;
    flex: 1;
    flex-direction: column;
    justify-content: center;
    margin: 0 0 0 10px;
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

const MobileImageContainerRow = styled.div`
    display: flex;
    flex: 1;
    flex-direction: row;
`;
const MobileImageContainerCol = styled.div`
    display: flex;
    flex: 1;
    flex-direction: column;
`;

const StoresContainer = styled.div`
    display: flex;
    flex-direction: row;
`;

const StickyText = styled.div`
    position: sticky;
    top: 50vh;
    transform: translateY(-50%);
    margin-top: 50%;
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

    console.log('render');

    return (
        <Bg>
            <Container>
                <DesktopContainer>
                    <DesktopTextContainer>
                        <StickyText>
                            <TextAccent margin="0 0 15px 0">
                                {translate('become-dj.available-on-iphone.desktop.available-on')}
                            </TextAccent>
                            <div
                                style={{ overflow: 'hidden', height: '64px', marginBottom: '18px' }}
                            >
                                <div
                                    style={{
                                        height: '64px',
                                        transition:
                                            'transform 500ms cubic-bezier(0.215, 0.610, 0.355, 1)',
                                    }}
                                    ref={textAnimation}
                                >
                                    <Header style={{ marginBottom: '0px' }} left>
                                        iPhone
                                    </Header>
                                    <Header style={{ marginBottom: '0px' }} left>
                                        Android
                                    </Header>
                                </div>
                            </div>
                            <GrayText>
                                {translate('become-dj.available-on-iphone.desktop.content')}
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
                                    <img
                                        src={appStore}
                                        alt="app store"
                                        style={{
                                            height: '50px',
                                            display: 'block',
                                        }}
                                    />
                                    <img
                                        src={playStore}
                                        alt="app store"
                                        style={{
                                            height: '50px',
                                            display: 'block',
                                            marginTop: '1px',
                                        }}
                                    />
                                </div>
                            </div>
                        </StickyText>
                    </DesktopTextContainer>
                    <DesktopImageContainer>
                        <img
                            src={iphoneX}
                            animate
                            alt="dj gigs iPhone"
                            style={{ width: '323px', alignSelf: 'center' }}
                        />
                        <img
                            ref={androidRef}
                            src={android}
                            animate
                            alt="dj gigs android"
                            style={{
                                width: '323px',
                                alignSelf: 'center',
                                marginTop: '200px',
                            }}
                        />
                    </DesktopImageContainer>
                </DesktopContainer>

                <MobileContainer>
                    <MobileTextContainer>
                        <TextAccent margin="0 0 15px 0">
                            {translate('become-dj.available-on-iphone.mobile.available-on')}
                        </TextAccent>
                        <BlueTitle left size="64px" line="64px" spacing="-1.33px">
                            iPhone & Android
                        </BlueTitle>
                        <GrayText mobileTextAlign="left">
                            {translate('become-dj.available-on-iphone.mobile.content')}
                        </GrayText>
                    </MobileTextContainer>
                    <MobileImageContainer>
                        <MobileImageContainerCol>
                            <GracefullImage
                                src={mobileLeft}
                                animate
                                alt="Mobile"
                                style={{ width: '100%', alignSelf: 'center', margin: '10px' }}
                            />
                        </MobileImageContainerCol>
                        <MobileImageContainerCol>
                            <GracefullImage
                                src={mobileRightTop}
                                animate
                                alt="Mobile"
                                style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    padding: '10px 0px 0px 10px',
                                    flex: '1',
                                }}
                            />
                            <GracefullImage
                                src={mobileRightBottom}
                                animate
                                alt="Mobile"
                                style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    padding: '10px 0px 10px 10px',
                                    flex: '1',
                                }}
                            />
                        </MobileImageContainerCol>
                    </MobileImageContainer>
                    <StoresContainer>
                        <GracefullImage
                            src={playStore}
                            animate
                            alt="Google Play store"
                            style={{
                                width: '54%',
                                alignSelf: 'center',
                                padding: '30px 10px 10px 0px',
                            }}
                        />
                        <GracefullImage
                            src={appStore}
                            animate
                            alt="Apple app store"
                            style={{
                                width: '46%',
                                alignSelf: 'center',
                                padding: '30px 0px 10px 0px',
                            }}
                        />
                    </StoresContainer>
                </MobileContainer>
            </Container>
        </Bg>
    );
};

export default addTranslate(AvailableOn);
