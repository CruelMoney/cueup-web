import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import ButtonLinkGlow from '../components/ButtonLinkGlow';

const Bg = styled.div`
    min-height: 100vh;
    width: 100vw;
    background-image: radial-gradient(50% 58%, #122b48 22%, #0b1b2d 59%);
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

const Hero = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Container>
            <Row center>
                <HeroCol>
                    <Title>{translate('become-dj.hero.the-only-profile-a-DJ-needs')}</Title>
                    <SubTitle white>{translate('become-dj.hero.subtitle')}</SubTitle>
                    <HeroButtonLink color="#00D1FF" to={props.firstTo} className="button elevated">
                        {translate('become-dj.hero.apply-to-become-dj')}
                    </HeroButtonLink>
                </HeroCol>
            </Row>
            <Row center />
            <Bg />
        </Container>
    );
};

export default addTranslate(Hero, content);
