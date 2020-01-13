import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import { TextAccent } from '../components/blocks/TextAccent';
import { Title } from '../components/blocks/Title';
import { PaddedContainer } from '../components/blocks/PaddedContainer';
import integrationsGraphic from '../../../assets/images/integrations/integrations_graphic.svg';
import integrationsGraphicMobile from '../../../assets/images/integrations/integrations_graphic_mobile.svg';

const Bg = styled.div`
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
`;

const IntegrationsWrapper = styled.div`
    display: flex;
    flex-direction: row;
`;

const IntegrationsCol = styled(Col)`
    width: 100%;
    @media only screen and (min-width: 685px) {
        background: no-repeat 100% 100%/70% url(${integrationsGraphic});
    }
`;

const IntegrationsText = styled.p`
    margin-top: 50px;
    font-family: AvenirNext-Medium;
    color: #ffffff;
    letter-spacing: -0.67px;
    line-height: 96px;
    font-size: 32px;
    font-family: AvenirNext-Medium;
    @media only screen and (max-width: 685px) {
        margin-top: 10px;
        font-size: 27px;
        color: #ffffff;
        letter-spacing: -0.56px;
        line-height: 60px;
    }
`;

const IntegrationsTextStarred = styled(IntegrationsText)`
    opacity: 0.5;
    font-size: 15px;
    letter-spacing: -0.31px;
`;

const MobileImage = styled.div`
    @media only screen and (max-width: 685px) {
        height: 330px;
        margin: 30px -15px 0 -15px;
        background: no-repeat 50% 100% url(${integrationsGraphicMobile});
    }
`;

const Integrations = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <IntegrationsWrapper>
                    <IntegrationsCol>
                        <MobileImage />
                        <TextAccent margin="0 0 20px 0">
                            {translate('become-dj.integrations.integrations')}
                        </TextAccent>
                        <TitleWrapper>
                            <Title left size="64px" line="64px" spacing="-1.33px">
                                {translate(
                                    'become-dj.integrations.combine-content-&-sell-yourself'
                                )}
                            </Title>
                        </TitleWrapper>
                        <IntegrationsText>
                            {translate('become-dj.integrations.instagram')} <br />
                            {translate('become-dj.integrations.soundcloud')} <br />
                            {translate('become-dj.integrations.testimonials')} <br />
                            {translate('become-dj.integrations.mixcloud')} <br />
                            {translate('become-dj.integrations.and-more')} <br />
                        </IntegrationsText>
                        <IntegrationsTextStarred>
                            {translate('become-dj.integrations.coming-soon')}
                        </IntegrationsTextStarred>
                    </IntegrationsCol>
                </IntegrationsWrapper>
            </Container>
        </Bg>
    );
};

export default addTranslate(Integrations, content);
