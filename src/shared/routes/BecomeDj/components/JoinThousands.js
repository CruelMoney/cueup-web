import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Body } from 'components/Text';
import { Container, ReadMore } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import GracefullImage from '../../../components/GracefullImage';
import dj1 from '../assets/1.jpg';
import dj2 from '../assets/2.jpg';
import dj3 from '../assets/3.jpg';
import dj4 from '../assets/4.jpg';
import dj5 from '../assets/5.jpg';
import dj6 from '../assets/6.jpg';
import dj7 from '../assets/7.jpg';
import dj8 from '../assets/8.jpg';
import dj9 from '../assets/9.jpg';
import dj10 from '../assets/10.jpg';
import dj11 from '../assets/11.jpg';
import dj12 from '../assets/12.jpg';
import dj13 from '../assets/13.jpg';
import dj14 from '../assets/14.jpg';
import dj15 from '../assets/15.jpg';
import dj16 from '../assets/16.jpg';
import dj17 from '../assets/17.jpg';
import dj18 from '../assets/18.jpg';
import dj19 from '../assets/19.jpg';
import dj20 from '../assets/20.jpg';
import { Header } from './blocks/Text';
import { SubTitle } from './blocks/SubTitle';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 2;
    width: 1600px;
    margin-top: 42px;
    margin-bottom: 50px;
    @media only screen and (max-width: 685px) {
        width: 886px;
    }
`;

const AvatarRow1 = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
`;

const AvatarRow2 = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: -30px;
`;

const AvatarWrapper = styled.div`
    width: 100px;
    height: 100px;
    border-radius: 50%;
    overflow: hidden;
    background-color: white;
    box-shadow: 0 0 4px 0 rgba(18, 43, 72, 0.1), 0 5px 10px -2px rgba(18, 43, 72, 0.64);
    margin-bottom: ${({ offset }) => (offset ? offset : '0px')};
    @media only screen and (max-width: 685px) {
        width: 70px;
        height: 70px;
    }
`;

const Filler = styled.div`
    width: 6.25%;
    display: flex;
    flex-shrink: 0;
    @media only screen and (max-width: 685px) {
        display: ${({ mobileHidden }) => (mobileHidden ? 'none' : 'auto')};
    }
`;

const BlueRectangle = styled.div`
    background-image: radial-gradient(50% 80% at 50% 100%, #00d1ff 0%, #00d1ff 80%, #0092b3 160%);
    box-shadow: 0 5px 22px -6px rgba(29, 44, 49, 0.05), 0 0 3px 0 rgba(33, 44, 49, 0.05);
    border-radius: 28px;
    z-index: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0 1em;
`;

const TextWrapper = styled.div`
    padding: 0 0 50px 0;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-content: center;
    @media only screen and (max-width: 685px) {
        padding: 0 0 50px 0;
    }
`;

const JoinThousands = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Container style={{ zIndex: 1, position: 'relative' }}>
            <BlueRectangle>
                <Wrapper>
                    <AvatarRow1>
                        <Avatar src={dj1} offset="20px" />
                        <Avatar src={dj2} offset="66px" />
                        <Avatar src={dj3} offset="10px" />
                        <Avatar src={dj4} offset="50px" />
                        <Avatar src={dj5} offset="0px" />
                        <Avatar src={dj6} offset="40px" />
                        <Avatar src={dj7} offset="0px" />
                        <Avatar src={dj8} offset="50px" />
                        <Avatar src={dj9} offset="10px" />
                        <Avatar src={dj10} offset="66px" />
                        <Avatar src={dj11} offset="20px" />
                    </AvatarRow1>
                    <AvatarRow2>
                        <Filler />
                        <Avatar src={dj12} offset="66px" />
                        <Avatar src={dj13} offset="10px" />
                        <Avatar src={dj14} offset="50px" />
                        <Avatar src={dj15} offset="0px" />
                        <Avatar src={dj16} offset="45px" />
                        <Avatar src={dj17} offset="0px" />
                        <Avatar src={dj18} offset="50px" />
                        <Avatar src={dj19} offset="10px" />
                        <Avatar src={dj20} offset="66px" />
                        <Filler />
                    </AvatarRow2>
                </Wrapper>
                <TextWrapper>
                    <Header center white>
                        {translate('become-dj.join-thousands-of-DJs.join-thousands-of-DJs')}
                    </Header>
                    <SubTitle white style={{ maxWidth: '577px' }}>
                        {translate('become-dj.join-thousands-of-DJs.content')}
                    </SubTitle>
                    <NavLink
                        to={translate('routes./signup')}
                        style={{ margin: 'auto', marginTop: '42px' }}
                    >
                        <ReadMore white size="18px" uppercase={false}>
                            {translate('become-dj.join-thousands-of-DJs.apply-to-become-DJ')}
                        </ReadMore>
                    </NavLink>
                </TextWrapper>
            </BlueRectangle>
        </Container>
    );
};

const Avatar = ({ src, ...rest }) => (
    <AvatarWrapper {...rest}>
        <GracefullImage
            animate
            src={src}
            alt="DJ-Avatar"
            style={{
                width: '100%',
                alignSelf: 'center',
                background: '#3febeb',
            }}
        />
    </AvatarWrapper>
);

export default addTranslate(JoinThousands);
