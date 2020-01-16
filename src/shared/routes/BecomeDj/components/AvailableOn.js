import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import { TextAccent } from '../components/blocks/TextAccent';
import { BlueTitle } from '../components/blocks/Title';
import { GrayText } from '../components/blocks/Text';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import mobileLeft from '../../../assets/images/available-on/1_front.png';
import mobileRightTop from '../../../assets/images/available-on/4.png';
import mobileRightBottom from '../../../assets/images/available-on/4 copy.png';
import mobileHovering from '../../../assets/images/available-on/iPhone X Hovering - Right.png';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    padding-top: 150px;
    padding-bottom: 150px;
    width: 100%;
    background-color: white;
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
    justify-content: center;
    margin: 50px 10px 50px 0;
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

const AvailableOn = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <DesktopContainer>
                    <DesktopTextContainer>
                        <TextAccent margin="0 0 15px 0">
                            {translate('become-dj.available-on-iphone.desktop.available-on')}
                        </TextAccent>
                        <BlueTitle left size="64px" line="64px" spacing="-1.33px">
                            {translate('become-dj.available-on-iphone.desktop.iphone')}
                        </BlueTitle>
                        <GrayText>
                            {translate('become-dj.available-on-iphone.desktop.content')}
                        </GrayText>
                    </DesktopTextContainer>
                    <DesktopImageContainer>
                        <GracefullImage
                            src={mobileHovering}
                            animate
                            alt="Gig request"
                            style={{ width: '70%', alignSelf: 'center' }}
                        />
                    </DesktopImageContainer>
                </DesktopContainer>

                <MobileContainer>
                    <MobileTextContainer>
                        <TextAccent margin="0 0 15px 0">
                            {translate('become-dj.available-on-iphone.mobile.available-on')}
                        </TextAccent>
                        <BlueTitle left size="64px" line="64px" spacing="-1.33px">
                            {translate('become-dj.available-on-iphone.mobile.iphone-and-android')}
                        </BlueTitle>
                        <GrayText>
                            {translate('become-dj.available-on-iphone.mobile.content')}
                        </GrayText>
                    </MobileTextContainer>
                    <MobileImageContainer>
                        <MobileImageContainerCol>
                            <GracefullImage
                                src={mobileLeft}
                                animate
                                alt="Gig request"
                                style={{ width: '100%', alignSelf: 'center', margin: '10px' }}
                            />
                        </MobileImageContainerCol>
                        <MobileImageContainerCol>
                            <GracefullImage
                                src={mobileRightTop}
                                animate
                                alt="Gig request"
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
                                alt="Gig request"
                                style={{
                                    width: '100%',
                                    alignSelf: 'center',
                                    padding: '10px 0px 10px 10px',
                                    flex: '1',
                                }}
                            />
                        </MobileImageContainerCol>
                    </MobileImageContainer>
                </MobileContainer>
            </Container>
        </Bg>
    );
};

export default addTranslate(AvailableOn, content);
