import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, Col, Row, PrimaryButton } from 'components/Blocks';
import { TextAccent } from '../../routes/BecomeDj/components/blocks/TextAccent';
import { SubTitle } from './SubTitle';
import { Title } from './Title';

const OrderedContainer = styled(Container)`
    order: 1;
    margin-bottom: ${({ marginBottom }) => (marginBottom ? marginBottom : '0px')};
`;

const HeroCol = styled(Col)`
    margin-top: 145px;
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
    transition: all 750ms ease;
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
        title,
        subtitle,
        heroContent,
        heroButtonText,
    } = props;
    return (
        <OrderedContainer marginBottom="130px">
            <Row center>
                <HeroCol>
                    <TextAccent center>{blueAccent}</TextAccent>
                    <Title>{title}</Title>
                    <SubTitle style={{ margin: '15px auto' }} white>
                        {subtitle}
                    </SubTitle>
                    {heroContent}
                    <NavLink to={props.firstTo} style={{ marginTop: '40px' }}>
                        <HeroButtonLink color="#00D1FF">{heroButtonText}</HeroButtonLink>
                    </NavLink>
                </HeroCol>
            </Row>
        </OrderedContainer>
    );
};

export default Hero;
