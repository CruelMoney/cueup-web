import React from 'react';
import styled from 'styled-components';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import { Header } from '../components/blocks/Text';
import { TextAccent } from '../components/blocks/TextAccent';
import { SubTitle } from '../components/blocks/SubTitle';
import ReadMore from '../components/blocks/ReadMore';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 7;
    background-image: radial-gradient(40% 50%, #122b48 20%, #0b1b2d 95%);
`;

const CancelationContainer = styled(Container)`
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 120px 0;
    @media only screen and (max-width: 685px) {
        margin: 80px 0;
    }
`;

const TitleWrapper = styled.div`
    max-width: 570px;
    margin: 0 0 20px 0;
`;

const CancelationSubTitle = styled(SubTitle)`
    width: 45%;
    @media only screen and (max-width: 685px) {
        width: 90%;
    }
`;

const Dot = styled.div`
    width: 17px;
    height: 17px;
    background: white;
    border-radius: 50%;
    margin: 30px 0;
`;

const BarText = styled.p`
    opacity: 0.75;
    font-size: 20px;
    color: #f9f9f9;
    text-align: center;
    line-height: 1.2em;
    @media only screen and (max-width: 685px) {
        font-size: 14px;
    }
`;
const BarWrapper = styled.div`
    background: #00d1ff;
    height: 34px;
    border-radius: 17px;
    position: relative;
    right: 0;
    top: 0;
`;

const GraphWrapper = styled.div`
    width: 80%;
    margin: 150px 0 80px 0;
    position: relative;
    @media only screen and (max-width: 685px) {
        width: 100%;
        margin: 100px 0 50px 0;
    }
`;

const Graph = styled.div`
    position: relative;
    > :nth-child(2) {
        position: absolute;
        width: 66%;
        background: #0092b3;
    }
    > :nth-child(3) {
        width: 33%;
        position: absolute;
        background: #005466;
    }
`;

const TextWrapper = styled(Row)`
    position: absolute;
    justify-content: space-around;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
`;

const CancelationPolicy = (props) => {
    const { translate } = props;
    return (
        <Bg>
            <CancelationContainer>
                <TextAccent center margin="50px 0 15px 0">
                    {translate('become-dj.cancelation-policy.feature')}
                </TextAccent>
                <TitleWrapper>
                    <Header white center>
                        {translate('become-dj.cancelation-policy.create-your-cancelation-policy')}
                    </Header>
                </TitleWrapper>
                <CancelationSubTitle white>
                    {translate('become-dj.cancelation-policy.content')}
                </CancelationSubTitle>
                <ReadMore white />
                <GraphWrapper>
                    <Graph>
                        <BarWrapper />
                        <BarWrapper />
                        <BarWrapper />
                    </Graph>
                    <TextWrapper>
                        <Col middle>
                            <BarText>
                                {translate('become-dj.cancelation-policy.chart.time.14-days-prior')}
                            </BarText>
                            <Dot />
                            <BarText>
                                {translate(
                                    'become-dj.cancelation-policy.chart.refund.100%-refund.100%-refund'
                                )}
                            </BarText>
                        </Col>
                        <Col middle>
                            <BarText>
                                {translate('become-dj.cancelation-policy.chart.time.event-start')}
                            </BarText>
                            <Dot />
                            <BarText>
                                {translate(
                                    'become-dj.cancelation-policy.chart.refund.50%-refund.50%-refund'
                                )}
                            </BarText>
                        </Col>
                        <Col middle>
                            <BarText>
                                {translate('become-dj.cancelation-policy.chart.time.event-end')}
                            </BarText>

                            <Dot />

                            <BarText>
                                {translate(
                                    'become-dj.cancelation-policy.chart.refund.0%-refund.0%-refund'
                                )}
                            </BarText>
                        </Col>
                    </TextWrapper>
                </GraphWrapper>
            </CancelationContainer>
        </Bg>
    );
};

export default addTranslate(CancelationPolicy);
