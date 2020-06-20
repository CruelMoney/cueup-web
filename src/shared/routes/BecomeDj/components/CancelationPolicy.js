import React from 'react';
import styled from 'styled-components';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Container, Col, Row, ReadMore } from 'components/Blocks';
import { appRoutes } from 'constants/locales/appRoutes';
import { TextAccent } from '../components/blocks/TextAccent';
import { Header } from './Text';
import { SubTitle } from './SubTitle';

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
`;

const CancelationSubTitle = styled(SubTitle)`
    max-width: 570px;
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

const CancelationPolicy = () => {
    const { t } = useTranslation();
    return (
        <Bg>
            <CancelationContainer>
                <TextAccent center style={{ marginTop: '50px' }}>
                    {t('become-dj:cancelation-policy.feature')}
                </TextAccent>
                <TitleWrapper>
                    <Header white center largeMargin>
                        Create your {'\n'}cancelation policy
                    </Header>
                </TitleWrapper>
                <CancelationSubTitle white>
                    When accepting payments using Cueup, your cancelation policy will automatically
                    be enforced, and you can define the policy exactly how you want.
                </CancelationSubTitle>
                <NavLink to={t(appRoutes.blog)} style={{ marginTop: '42px' }}>
                    <ReadMore white size="18px" uppercase={false}>
                        {t('read-more')}
                    </ReadMore>
                </NavLink>
                <GraphWrapper>
                    <Graph>
                        <BarWrapper />
                        <BarWrapper />
                        <BarWrapper />
                    </Graph>
                    <TextWrapper>
                        <Col middle>
                            <BarText>
                                {t('become-dj:cancelation-policy.chart.time.30-days-prior')}
                            </BarText>
                            <Dot />
                            <BarText>
                                {t(
                                    'become-dj:cancelation-policy.chart.refund.100%-refund.100%-refund'
                                )}
                            </BarText>
                        </Col>
                        <Col middle>
                            <BarText>
                                {t('become-dj:cancelation-policy.chart.time.14-days-prior')}
                            </BarText>
                            <Dot />
                            <BarText>
                                {t(
                                    'become-dj:cancelation-policy.chart.refund.50%-refund.50%-refund'
                                )}
                            </BarText>
                        </Col>
                        <Col middle>
                            <BarText>
                                {t('become-dj:cancelation-policy.chart.time.event-start')}
                            </BarText>

                            <Dot />

                            <BarText>
                                {t('become-dj:cancelation-policy.chart.refund.0%-refund.0%-refund')}
                            </BarText>
                        </Col>
                    </TextWrapper>
                </GraphWrapper>
            </CancelationContainer>
        </Bg>
    );
};

export default CancelationPolicy;
