import React, { useState } from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { Container, ReadMore } from 'components/Blocks';
import GracefullImage from 'components/GracefullImage';
import { H2 } from 'components/Text';
import dj1 from '../assets/people/joinThousands/1.jpg';
import dj2 from '../assets/people/joinThousands/2.jpg';
import dj3 from '../assets/people/joinThousands/3.jpg';
import dj4 from '../assets/people/joinThousands/4.jpg';
import dj5 from '../assets/people/joinThousands/5.jpg';
import dj6 from '../assets/people/joinThousands/6.jpg';
import dj7 from '../assets/people/joinThousands/7.jpg';
import dj8 from '../assets/people/joinThousands/8.jpg';
import dj9 from '../assets/people/joinThousands/9.jpg';
import dj10 from '../assets/people/joinThousands/10.jpg';
import dj11 from '../assets/people/joinThousands/11.jpg';
import dj12 from '../assets/people/joinThousands/12.jpg';
import dj13 from '../assets/people/joinThousands/13.jpg';
import dj14 from '../assets/people/joinThousands/14.jpg';
import dj15 from '../assets/people/joinThousands/15.jpg';
import dj16 from '../assets/people/joinThousands/16.jpg';
import dj17 from '../assets/people/joinThousands/17.jpg';
import dj18 from '../assets/people/joinThousands/18.jpg';
import dj19 from '../assets/people/joinThousands/19.jpg';
import dj20 from '../assets/people/joinThousands/20.jpg';
import { SubTitle } from './SubTitle';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    z-index: 3;
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
    border-radius: 50px;
    img {
        width: 100px;
        height: 100px;
        border-radius: 50px;
    }
    overflow: hidden;
    background-color: white;
    box-shadow: 0 0 4px 0 rgba(18, 43, 72, 0.1), 0 5px 10px -2px rgba(18, 43, 72, 0.64);
    margin-bottom: ${({ offset }) => (offset ? offset : '0px')};
    cursor: default;
    @media only screen and (max-width: 685px) {
        width: 70px;
        height: 70px;
        border-radius: 35px;
        img {
            width: 70px;
            height: 70px;
            border-radius: 35px;
        }
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
    box-shadow: 0 0 12px 0 rgba(0, 0, 0, 0.06), 0 13px 13px 0 rgba(0, 0, 0, 0.08),
        0 20px 15px 0 rgba(0, 0, 0, 0.04);
    border-radius: 28px;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    padding: 0 1em;
    z-index: 1;
    position: relative;
`;

const TextWrapper = styled.div`
    padding: 0 0 50px 0;
    width: 100%;
    max-width: 550px;
    display: flex;
    flex-direction: column;
    align-content: center;
    @media only screen and (max-width: 685px) {
        padding: 0 0 50px 0;
    }
`;

const OverflowContainer = styled.div`
    max-width: 100vw;
    overflow-x: hidden;
    padding-bottom: 60px;
    margin-bottom: -60px;
`;

const JoinThousands = (props) => {
    const [hover, setHover] = useState(false);
    const { title, description, label, to } = props;
    return (
        <OverflowContainer>
            <Container>
                <NavLink to={to}>
                    <BlueRectangle
                        onMouseEnter={() => setHover(true)}
                        onMouseLeave={() => setHover(false)}
                    >
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
                            <H2 center white largeMargin>
                                {title}
                            </H2>
                            {description && (
                                <SubTitle
                                    white
                                    style={{
                                        maxWidth: '520px',
                                        fontWeight: 500,
                                        whiteSpace: 'pre-line',
                                        marginBottom: '42px',
                                    }}
                                >
                                    {description}
                                </SubTitle>
                            )}

                            <ReadMore center white size="18px" uppercase={false} active={hover}>
                                {label}
                            </ReadMore>
                        </TextWrapper>
                    </BlueRectangle>
                </NavLink>
            </Container>
        </OverflowContainer>
    );
};

const Avatar = ({ src, ...rest }) => (
    <AvatarWrapper {...rest}>
        <GracefullImage animate src={src} lazyload alt="DJ-Avatar" />
    </AvatarWrapper>
);

export default JoinThousands;
