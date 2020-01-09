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
    width: 100vw;
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
`;

const TextAccent = styled.h3`
    color: #00d1ff;
    text-align: center;
    font-size: 15px;
    ${(margin) => (margin ? margin : '0')}
`;

export const Title = styled.h1`
    color: #fff;
    margin-bottom: 0.3em;
    display: inline-block;
    position: relative;
    font-size: 72px;
    letter-spacing: -1.5px;
    text-align: center;
    line-height: 72px;
    @media only screen and (max-width: 425px) {
        font-size: 42px;
        line-height: 45px;
        > * {
            display: none;
        }
    }
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

const GetGigsWrapperCol = styled(Col)`
    flex: 1;
    margin-top: 130px;
    justify-content: center;
    width: 100%;
`;
const GetGigsTextRow = styled(Row)`
    order: 1;
    flex: 1;
    align-self: center;
    justify-content: space-between;
    width: 83%;
    flex-wrap: wrap;
    @media only screen and (max-width: 685px) {
        order: 2;
        margin-top: 20px;
        width: 100%;
    }
`;

const GetGigsTextRowCol = styled(Col)`
    padding: 10px;
    @media only screen and (max-width: 375px) {
        flex-basis: 100%;
    }
    @media only screen and (min-width: 375px) and (max-width: 685px) {
        flex-basis: 50%;
    }
`;
const GetGigsTextRowCol1 = styled(GetGigsTextRowCol)`
    order: 1;
`;
const GetGigsTextRowCol2 = styled(GetGigsTextRowCol)`
    order: 2;
`;
const GetGigsTextRowCol3 = styled(GetGigsTextRowCol)`
    order: 3;
    @media only screen and (max-width: 685px) {
        order: 4;
    }
`;
const GetGigsTextRowCol4 = styled(GetGigsTextRowCol)`
    order: 4;
    @media only screen and (max-width: 685px) {
        order: 3;
    }
`;

const GetGigsTextRowColFirstRow = styled(Row)`
    opacity: 0.5;
    font-family: AvenirNext-DemiBold;
    font-size: 12px;
    color: #ffffff;
`;

const GetGigsTextRowColSecondRow = styled(Row)`
    font-family: AvenirNext-Bold;
    font-size: 32px;
    color: #ffffff;
`;

const GetGigsImageRow = styled(Row)`
    order: 2;
    @media only screen and (max-width: 685px) {
        order: 1;
    }
    justify-content: center;
    margin-top: 10px;
`;

const GracefullImageDJProfile = styled(GracefullImage)`
    width: 100%;
`;

const Hero = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <Row center>
                    <HeroCol>
                        <TextAccent margin="0 0 15px 0">
                            {translate('become-dj.hero.2020-update')}
                        </TextAccent>
                        <Title>{translate('become-dj.hero.the-only-profile-a-DJ-needs')}</Title>
                        <SubTitle white>{translate('become-dj.hero.subtitle')}</SubTitle>
                        <HeroButtonLink
                            color="#00D1FF"
                            to={props.firstTo}
                            className="button elevated"
                        >
                            {translate('become-dj.hero.apply-to-become-dj')}
                        </HeroButtonLink>
                    </HeroCol>
                </Row>
                <Row>
                    <GetGigsWrapperCol>
                        <GetGigsTextRow>
                            <GetGigsTextRowCol1>
                                <GetGigsTextRowColFirstRow>
                                    {translate('become-dj.hero.get-gigs.get')}
                                </GetGigsTextRowColFirstRow>
                                <GetGigsTextRowColSecondRow>
                                    {translate('become-dj.hero.get-gigs.gigs')}
                                </GetGigsTextRowColSecondRow>
                            </GetGigsTextRowCol1>
                            <GetGigsTextRowCol2>
                                <GetGigsTextRowColFirstRow>
                                    {translate('become-dj.hero.upload-mixtapes.upload')}
                                </GetGigsTextRowColFirstRow>
                                <GetGigsTextRowColSecondRow>
                                    {translate('become-dj.hero.upload-mixtapes.mixtapes')}
                                </GetGigsTextRowColSecondRow>
                            </GetGigsTextRowCol2>
                            <GetGigsTextRowCol3>
                                <GetGigsTextRowColFirstRow>
                                    {translate('become-dj.hero.showcase-photos.showcase')}
                                </GetGigsTextRowColFirstRow>
                                <GetGigsTextRowColSecondRow>
                                    {translate('become-dj.hero.showcase-photos.photos')}
                                </GetGigsTextRowColSecondRow>
                            </GetGigsTextRowCol3>
                            <GetGigsTextRowCol4>
                                <GetGigsTextRowColFirstRow>
                                    {translate('become-dj.hero.add-reviews.add')}
                                </GetGigsTextRowColFirstRow>
                                <GetGigsTextRowColSecondRow>
                                    {translate('become-dj.hero.add-reviews.reviews')}
                                </GetGigsTextRowColSecondRow>
                            </GetGigsTextRowCol4>
                        </GetGigsTextRow>
                        <GetGigsImageRow>
                            <GracefullImageDJProfile
                                src={DJProfileDesktopImage}
                                animate
                                alt="cueup DJ profile - desktop"
                                style={{ width: '100%' }}
                            />
                        </GetGigsImageRow>
                    </GetGigsWrapperCol>
                </Row>
            </Container>
        </Bg>
    );
};

export default addTranslate(Hero, content);
