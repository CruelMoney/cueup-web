import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import { Title } from '../components/blocks/Title';
import { TextAccent } from '../components/blocks/TextAccent';
import { SubTitle } from '../components/blocks/SubTitle';
import ReadMore from '../components/blocks/ReadMore';

const Bg = styled.div`
    width: 100%;
    order: 7;
    background-image: radial-gradient(90% 50% at 50% 80%, #122b48 6%, #0b1b2d 86%);
`;

const CancelationContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 0 120px 0;
`;

const TitleWrapper = styled.div`
    width: 60%;
    margin: 0 0 50px 0;
`;

const CancelationSubTitle = styled(SubTitle)`
    width: 45%;
    @media only screen and (max-width: 685px) {
        width: 90%;
    }
`;

const GraphWrapper = styled.div`
    width: 80%;
    position: relative;
    margin: 120px 0 80px 0;
`;

const Dot1 = styled.div`
    width: 17px;
    height: 17px;
    background: white;
    border-radius: 50%;
    position: absolute;
    right: 69%;
    top: 25%;
    z-index: 5;
    @media only screen and (max-width: 685px) {
        right: 93%;
    }
`;

const Dot2 = styled.div`
    width: 17px;
    height: 17px;
    background: white;
    border-radius: 50%;
    position: absolute;
    right: 29%;
    top: 25%;
    z-index: 5;
    @media only screen and (max-width: 685px) {
        right: 53%;
    }
`;

const Dot3 = styled.div`
    width: 17px;
    height: 17px;
    background: white;
    border-radius: 50%;
    position: absolute;
    right: 10%;
    top: 25%;
    z-index: 5;
    @media only screen and (max-width: 685px) {
        right: 8%;
    }
`;
const Bar1 = styled.div`
    width: 99%;
    height: 34px;
    background: #00d1ff;
    box-shadow: 0 0 20px 0 #0e1c2c;
    border-radius: 17px;
    position: relative;
`;
const Bar2 = styled.div`
    width: 66%;
    height: 34px;
    background: #0092b3;
    box-shadow: 0 0 20px 0 #0e1c2c;
    border-radius: 17px;
    position: relative;
`;
const Bar3 = styled.div`
    height: 34px;
    background: #005466;
    box-shadow: 0 0 20px 0 #0e1c2c;
    border-radius: 17px;
    position: relative;
`;

const Bar1Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 99%;
    position: absolute;
    right: 0;
`;

const Bar2Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 66%;
    position: absolute;
    right: 0;
`;

const Bar3Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    width: 33%;
    position: absolute;
    right: 0;
`;

const Bar1TopText = styled.p`
    opacity: 0.75;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #f9f9f9;
    position: absolute;
    text-align: center;
    left: 22%;
    top: -47px;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
        left: 0px;
        top: -60px;
        width: 50px;
    }
`;
const Bar2TopText = styled.p`
    opacity: 0.75;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #f9f9f9;
    position: absolute;
    text-align: center;
    left: 35%;
    top: -47px;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
        left: 19%;
        top: -60px;
        width: 50px;
    }
`;
const Bar3TopText = styled.p`
    opacity: 0.75;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #f9f9f9;
    position: absolute;
    text-align: center;
    left: 70%;
    top: -47px;
    width: 100px;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
        left: 64%;
        top: -60px;
        width: 50px;
    }
`;
const Bar1BottomText = styled.p`
    opacity: 0.75;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #f9f9f9;
    position: absolute;
    text-align: center;
    left: 24%;
    top: 47px;
    width: 90px;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
        left: 0%;
        top: 47px;
        width: 46px;
    }
`;
const Bar2BottomText = styled.p`
    opacity: 0.75;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #f9f9f9;
    position: absolute;
    text-align: center;
    left: 37%;
    top: 47px;
    width: 90px;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
        left: 20%;
        top: 47px;
        width: 46px;
    }
`;
const Bar3BottomText = styled.p`
    opacity: 0.75;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #f9f9f9;
    position: absolute;
    text-align: center;
    left: 70%;
    top: 47px;
    width: 90px;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
        left: 70%;
        top: 47px;
        width: 46px;
    }
`;

const CancelationPolicy = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <CancelationContainer>
                <TextAccent center margin="50px 0 15px 0">
                    {translate('become-dj.cancelation-policy.feature')}
                </TextAccent>
                <TitleWrapper>
                    <Title>
                        {translate('become-dj.cancelation-policy.create-your-cancelation-policy')}
                    </Title>
                </TitleWrapper>
                <CancelationSubTitle white>
                    {translate('become-dj.cancelation-policy.content')}
                </CancelationSubTitle>
                <ReadMore white />
                <GraphWrapper>
                    <Bar1Wrapper>
                        <Bar1TopText>
                            {translate('become-dj.cancelation-policy.chart.time.14-days-prior')}
                        </Bar1TopText>
                        <Bar1>
                            <Dot1 />
                        </Bar1>
                        <Bar1BottomText>
                            {translate(
                                'become-dj.cancelation-policy.chart.refund.100%-refund.100%-refund'
                            )}
                        </Bar1BottomText>
                    </Bar1Wrapper>
                    <Bar2Wrapper>
                        <Bar2TopText>
                            {translate('become-dj.cancelation-policy.chart.time.event-start')}
                        </Bar2TopText>
                        <Bar2>
                            <Dot2 />
                        </Bar2>
                        <Bar2BottomText>
                            {translate(
                                'become-dj.cancelation-policy.chart.refund.50%-refund.50%-refund'
                            )}
                        </Bar2BottomText>
                    </Bar2Wrapper>
                    <Bar3Wrapper>
                        <Bar3TopText>
                            {translate('become-dj.cancelation-policy.chart.time.event-end')}
                        </Bar3TopText>
                        <Bar3>
                            <Dot3 />
                        </Bar3>
                        <Bar3BottomText>
                            {translate(
                                'become-dj.cancelation-policy.chart.refund.0%-refund.0%-refund'
                            )}
                        </Bar3BottomText>
                    </Bar3Wrapper>
                </GraphWrapper>
            </CancelationContainer>
        </Bg>
    );
};

export default addTranslate(CancelationPolicy, content);
