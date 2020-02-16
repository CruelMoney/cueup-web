import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, Col, Row, PrimaryButton } from 'components/Blocks';
import { TextAccent } from '../../routes/BecomeDj/components/blocks/TextAccent';
import { Title } from '../../routes/BecomeDj/components/blocks/Title';
import { SubTitle } from '../../routes/BecomeDj/components/blocks/SubTitle';
import addTranslate from '../higher-order/addTranslate';

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
    min-width: 250px;
    transition-duration: 750ms;
    :hover {
        box-shadow: 0 0 70px #00d1ff;
        transform: scale(1.02);
    }
`;

const Hero = (props) => {
    const {
        translate,
        // eslint-disable-next-line no-unused-vars
        currentLanguage,
        blueAccent,
        titleLine1,
        titleLine2,
        subtitle,
        heroContent,
        heroButtonText,
    } = props;
    return (
        <OrderedContainer>
            <Row center>
                <HeroCol>
                    <TextAccent center>{blueAccent}</TextAccent>
                    <Title>
                        {/* The only profile <br />a DJ needs. */}
                        {titleLine1}
                        <br />
                        {titleLine2}
                    </Title>
                    <SubTitle style={{ margin: '15px auto' }} white>
                        {/* As a DJ you don't want to waste time promoting yourself when you could be
                        out playing. Cueup makes it simple to get booked. */}
                        {subtitle}
                    </SubTitle>
                    {heroContent}
                    <NavLink to={translate('routes./signup')} style={{ marginTop: '40px' }}>
                        <HeroButtonLink color="#00D1FF" to={props.firstTo}>
                            {/* {translate('become-dj.hero.apply-to-become-dj')} */}
                            {heroButtonText}
                        </HeroButtonLink>
                    </NavLink>
                </HeroCol>
            </Row>
        </OrderedContainer>
    );
};

export default addTranslate(Hero);
