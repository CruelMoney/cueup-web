import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import ButtonLinkGlow from '../components/ButtonLinkGlow';
import GracefullImage from '../../../components/GracefullImage';
import DJProfileDesktopImage from '../../../assets/images/desktop-cueup.png';

const Bg = styled.div`
    min-height: 300vh;
    height: 300vh;
    width: 100vw;
    overflow-x: hidden;
    background-image: radial-gradient(50% 58%, #122b48 22%, #0b1b2d 59%);
    box-shadow: 0 5px 22px -6px rgba(29, 44, 49, 0.05), 0 0 3px 0 rgba(33, 44, 49, 0.05);
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    z-index: -1;
`;

const Title = styled(HeaderTitle)`
    font-size: 72px;
    letter-spacing: -1.5px;
    text-align: center;
    line-height: 72px;
`;

const SubTitle = styled(Body)`
    font-size: 20px;
    text-align: center;
    width: 336px;
    margin: auto;
`;

const HeroCol = styled(Col)`
    margin-top: 145px;
    width: 550px;
`;

const HeroButtonLink = styled(ButtonLinkGlow)`
    display: block;
    margin-top: 40px;
    font-size: 18px;
    height: 50px;
    box-shadow: 0px 0px 30px 30px #31daff;
`;

const TextAccent = styled.h3`
    color: #00d1ff;
    text-align: center;
    font-size: 15px;
    ${(margin) => (margin ? margin : '0')}
`;

const GetGigsFirstRow = styled(Row)`
    order: 1;
    @media only screen and (max-width: 425px) {
        order: 2;
    }
    flex: 1;
    align-self: center;
    justify-content: space-between;
    width: 80%;
`;

const GetGigsSecondRow = styled(Row)`
    order: 2;
    @media only screen and (max-width: 425px) {
        order: 1;
    }
    justify-content: center;
    margin-top: 20px;
`;

const GetGigsWrapperCol = styled(Col)`
    flex: 1;
    margin-top: 130px;
    justify-content: center;
`;

const GetGigsCol = styled(Col)``;

const GetGigsColFirstRow = styled(Row)`
    opacity: 0.5;
    font-family: AvenirNext-DemiBold;
    font-size: 12px;
    color: #ffffff;
`;

const GetGigsColSecondRow = styled(Row)`
    font-family: AvenirNext-Bold;
    font-size: 32px;
    color: #ffffff;
`;

const GracefullImageDJProfile = styled(GracefullImage)`
    width: 100%;
`;

const Hero = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Container>
            <Row center>
                <HeroCol>
                    <TextAccent margin="0 0 15px 0">
                        {translate('become-dj.hero.2020-update')}
                    </TextAccent>
                    <Title>{translate('become-dj.hero.the-only-profile-a-DJ-needs')}</Title>
                    <SubTitle white>{translate('become-dj.hero.subtitle')}</SubTitle>
                    <HeroButtonLink color="#00D1FF" to={props.firstTo} className="button elevated">
                        {translate('become-dj.hero.apply-to-become-dj')}
                    </HeroButtonLink>
                </HeroCol>
            </Row>
            <Row>
                <GetGigsWrapperCol>
                    <GetGigsFirstRow>
                        <GetGigsCol>
                            <GetGigsColFirstRow>
                                {translate('become-dj.hero.get-gigs.get')}
                            </GetGigsColFirstRow>
                            <GetGigsColSecondRow>
                                {translate('become-dj.hero.get-gigs.gigs')}
                            </GetGigsColSecondRow>
                        </GetGigsCol>
                        <GetGigsCol>
                            <GetGigsColFirstRow>
                                {translate('become-dj.hero.upload-mixtapes.upload')}
                            </GetGigsColFirstRow>
                            <GetGigsColSecondRow>
                                {translate('become-dj.hero.upload-mixtapes.mixtapes')}
                            </GetGigsColSecondRow>
                        </GetGigsCol>
                        <GetGigsCol>
                            <GetGigsColFirstRow>
                                {translate('become-dj.hero.showcase-photos.showcase')}
                            </GetGigsColFirstRow>
                            <GetGigsColSecondRow>
                                {translate('become-dj.hero.showcase-photos.photos')}
                            </GetGigsColSecondRow>
                        </GetGigsCol>
                        <GetGigsCol>
                            <GetGigsColFirstRow>
                                {translate('become-dj.hero.add-reviews.add')}
                            </GetGigsColFirstRow>
                            <GetGigsColSecondRow>
                                {translate('become-dj.hero.add-reviews.reviews')}
                            </GetGigsColSecondRow>
                        </GetGigsCol>
                    </GetGigsFirstRow>
                    <GetGigsSecondRow>
                        <GracefullImageDJProfile
                            src={DJProfileDesktopImage}
                            animate
                            alt="cueup DJ profile - desktop"
                            style={{ width: '100%' }}
                        />
                    </GetGigsSecondRow>
                </GetGigsWrapperCol>
            </Row>
            <Bg />
        </Container>
    );
};

export default addTranslate(Hero, content);
