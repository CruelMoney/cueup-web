import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import { Body } from 'components/Text';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import { TextAccent } from '../components/blocks/TextAccent';
import { Title } from '../components/blocks/Title';
import { SubTitle } from '../components/blocks/SubTitle';
import ButtonLinkGlow from './blocks/ButtonLinkGlow';

const OrderedContainer = styled(Container)`
    order: 1;
    margin-bottom: 130px;
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
        <OrderedContainer>
            <Row center>
                <HeroCol>
                    <TextAccent center margin="0 0 15px 0">
                        {translate('become-dj.hero.2020-update')}
                    </TextAccent>
                    <Title>{translate('become-dj.hero.the-only-profile-a-DJ-needs')}</Title>
                    <SubTitle white>{translate('become-dj.hero.subtitle')}</SubTitle>
                    <HeroButtonLink color="#00D1FF" to={props.firstTo} className="button elevated">
                        {translate('become-dj.hero.apply-to-become-dj')}
                    </HeroButtonLink>
                </HeroCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Hero, content);
