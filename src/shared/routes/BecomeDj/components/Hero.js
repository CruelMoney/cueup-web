import React from 'react';
import styled from 'styled-components';
import { NavLink as Link, NavLink } from 'react-router-dom';
import { Container, Col, Row, PrimaryButton } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import { TextAccent } from '../components/blocks/TextAccent';
import { Title } from '../components/blocks/Title';
import { SubTitle } from '../components/blocks/SubTitle';
import Pattern from './blocks/Pattern';

const OrderedContainer = styled(Container)`
    order: 1;
    margin-bottom: 130px;
`;

const HeroCol = styled(Col)`
    margin-top: 145px;
    width: 550px;
    position: relative;
`;

const HeroButtonLink = styled(PrimaryButton)`
    height: 50px;
    line-height: 50px;
    border-radius: 13px;
    font-size: 18px;
    box-shadow: 0 0 45px #00d1ff;
    margin: 0 auto;
    text-align: center;
    max-width: 250px;
    transition-duration: 750ms;
    :hover {
        box-shadow: 0 0 70px #00d1ff;
        transform: scale(1.02);
    }
`;

const Hero = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <OrderedContainer>
            <Row center>
                <HeroCol>
                    <Pattern style={{ right: '-175px', top: '50px' }} />
                    <TextAccent center margin="0 0 15px 0">
                        {translate('become-dj.hero.2020-update')}
                    </TextAccent>
                    <Title>{translate('become-dj.hero.the-only-profile-a-DJ-needs')}</Title>
                    <SubTitle white>{translate('become-dj.hero.subtitle')}</SubTitle>
                    <NavLink
                        to={translate('routes./signup')}
                        style={{ margin: 'auto', marginTop: '40px' }}
                    >
                        <HeroButtonLink color="#00D1FF" to={props.firstTo}>
                            {translate('become-dj.hero.apply-to-become-dj')}
                        </HeroButtonLink>
                    </NavLink>
                </HeroCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Hero);
