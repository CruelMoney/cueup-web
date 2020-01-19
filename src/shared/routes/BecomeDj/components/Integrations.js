import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import GracefullImage from '../../../components/GracefullImage';
import { TextAccent } from '../components/blocks/TextAccent';
import { Title } from '../components/blocks/Title';
import { PaddedContainer } from '../components/blocks/PaddedContainer';
import integrationsGraphic from '../../../assets/images/integrations/Brands.png';
import integrationsGraphicMobile from '../../../assets/images/integrations/Brands_mobile.png';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    background-color: #0b1b2d;
    z-index: 1;
    padding-top: 20px;
    order: 4;
    margin-top: 100px;
`;

const TitleWrapper = styled.div`
    max-width: 570px;
    align-self: flex-start;
    @media only screen and (min-width: 375px) {
        position: relative;
        :after {
            content: '';
            background: url(${integrationsGraphic});
            background-size: 100% 100%;
            background-repeat: no-repeat;
            width: 846px;
            height: 764px;
            position: absolute;
            right: 0;
            bottom: 0;
            transform: translate(75%, 90%);
        }
    }
`;

const IntegrationsWrapper = styled.div`
    display: flex;
    flex-direction: row;
    margin-top: 200px;
`;

const IntegrationsCol = styled(Col)`
    width: 100%;
    position: relative;
`;

const IntegrationsText = styled.ul`
    margin-top: 15px;
    margin-bottom: 100px;
    > p {
        font-family: 'AvenirNext-Medium';
        color: #fff;
        letter-spacing: -0.67px;
        font-size: 32px;
    }
    @media only screen and (max-width: 375px) {
        margin-top: 10px;
        > p {
            font-size: 27px;
            color: #ffffff;
            letter-spacing: -0.56px;
            line-height: 60px;
        }
    }
`;

const IntegrationsTextStarred = styled(IntegrationsText)`
    > p {
        opacity: 0.5;
        font-size: 15px;
        letter-spacing: -0.31px;
        position: absolute;
        bottom: 15px;
        left: 0;
        @media only screen and (max-width: 375px) {
            font-size: 15px;
        }
    }
`;

const MobileImage = styled.div`
    @media only screen and (max-width: 375px) {
        height: 330px;
        margin: 30px -15px 0 -15px;
        background: no-repeat 50% 100% url(${integrationsGraphicMobile});
        background-size: contain;
    }
`;

const Integrations = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Container>
            <IntegrationsWrapper>
                <IntegrationsCol>
                    <MobileImage />
                    <TextAccent margin="0 0 20px 0">
                        {translate('become-dj.integrations.integrations')}
                    </TextAccent>
                    <TitleWrapper>
                        <Title left size="64px" line="64px" spacing="-1.33px">
                            {translate('become-dj.integrations.combine-content-&-sell-yourself')}
                        </Title>
                    </TitleWrapper>
                    <IntegrationsText>
                        <p>{translate('become-dj.integrations.instagram')}</p>
                        <p>{translate('become-dj.integrations.soundcloud')}</p>
                        <p>{translate('become-dj.integrations.testimonials')}</p>
                        <p>{translate('become-dj.integrations.mixcloud')}</p>
                        <p>{translate('become-dj.integrations.and-more')}</p>
                    </IntegrationsText>
                    <IntegrationsTextStarred>
                        <p>{translate('become-dj.integrations.coming-soon')}</p>
                    </IntegrationsTextStarred>
                </IntegrationsCol>
            </IntegrationsWrapper>
        </Container>
    );
};

export default addTranslate(Integrations);
