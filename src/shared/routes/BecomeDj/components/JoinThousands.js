import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import { Title } from '../components/blocks/Title';
import { PaddedContainer } from '../components/blocks/PaddedContainer';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import Apply from '../components/blocks/Apply';
import vynil from '../../../assets/Vinyl@2x.png';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 9;
    z-index: 20;
    position: relative;
    height: 730px;
    @media only screen and (max-width: 685px) {
        height: 720px;
    }
`;

const JoinThousandsContainer = styled.div`
    position: relative;
    width: 90%;
`;

const AvatarWrapper = styled.div`
    display: flex;
    flex-direction: column;
    padding: 40px 3% 40px 3%;
    z-index: 21;
    width: 100%;
    @media only screen and (max-width: 685px) {
        padding: 30px 0px;
    }
`;

const AvatarRow1 = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-bottom: 12px;
    @media only screen and (max-width: 685px) {
        margin-left: -20px;
        margin-right: -20px;
    }
`;

const AvatarRow2 = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: -30px;
    @media only screen and (max-width: 685px) {
        margin-left: -20px;
        margin-right: -20px;
    }
`;

const Avatar = styled.div`
    width: 6.25%;
    border-radius: 50%;
    background-color: white;
    box-shadow: 0 0 4px 0 rgba(18, 43, 72, 0.1), 0 5px 10px -2px rgba(18, 43, 72, 0.64);
    margin-bottom: ${({ offset }) => (offset ? offset : '0px')};
    @media only screen and (max-width: 685px) {
        display: ${({ mobileHidden }) => (mobileHidden ? 'none' : 'auto')};
        width: 15%;
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
    background-image: radial-gradient(60% 110% at 50% 100%, #00d1ff 0%, #00d1ff 53%, #0092b3 150%);
    box-shadow: 0 5px 22px -6px rgba(29, 44, 49, 0.05), 0 0 3px 0 rgba(33, 44, 49, 0.05);
    border-radius: 28px;
    width: 66%;
    height: 90%;
    position: absolute;
    bottom: 10%;
    left: 17%;
    z-index: 20;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    align-items: center;
    @media only screen and (max-width: 685px) {
        width: 90%;
        left: 5%;
    }
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

const Content = styled(Body)`
    font-size: 20px;
    text-align: center;
    margin: auto;
    width: 70%;
`;

const JoinThousands = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <AvatarWrapper>
                <AvatarRow1>
                    <Avatar offset="20px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="66px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="10px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="50px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="0px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="40px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="0px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="50px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="10px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="66px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="20px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                </AvatarRow1>
                <AvatarRow2>
                    <Filler mobileHidden />
                    <Avatar offset="66px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="10px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="50px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="0px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="45px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="0px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="50px">
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="10px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Avatar offset="66px" mobileHidden>
                        <GracefullImage
                            src={vynil}
                            animate
                            alt="DJ-Avatar"
                            style={{
                                width: '100%',
                                alignSelf: 'center',
                            }}
                        />
                    </Avatar>
                    <Filler mobileHidden />
                </AvatarRow2>
            </AvatarWrapper>
            <BlueRectangle>
                <TextWrapper>
                    <Title center size="64px" line="64px" spacing="-1.33px">
                        {translate('become-dj.join-thousands-of-DJs.join-thousands-of-DJs')}
                    </Title>
                    <Content white>{translate('become-dj.join-thousands-of-DJs.content')}</Content>
                    <Apply white />
                </TextWrapper>
            </BlueRectangle>
        </Bg>
    );
};

export default addTranslate(JoinThousands, content);
