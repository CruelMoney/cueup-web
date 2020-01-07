import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';

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
`;

const HeroCol = styled(Col)`
    margin-top: 145px;
    width: 550px;
`;

const Hero = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Container>
            <Row center>
                <HeroCol>
                    <Title>{translate('become-dj.hero.the-only-profile-a-DJ-needs')}</Title>
                    <SubTitle>{translate('become-dj.hero.subtitle')}</SubTitle>
                </HeroCol>
            </Row>
            <Row center>
                <Body white>text</Body>
            </Row>
            <Bg />
        </Container>
    );
};

export default addTranslate(Hero, content);
