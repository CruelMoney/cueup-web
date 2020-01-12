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

const Bg = styled.div`
    width: 100vw;
    // height: 100vh;
    background-color: #0b1b2d;
`;

const TitleWrapper = styled.div`
    width: 570px;
    align-self: flex-start;
`;

const IntegrationsWrapper = styled.div`
    display: flex;
    flex-direction: row;

    @media only screen and (maxwidth: 685px) {
        flex-direction: column;
    }
`;

const IntegrationsCol = styled(Col)`
    width: 100%;
    background: no-repeat 100% 100%/70% url(${integrationsGraphic});
    background-origin: content-box;
`;

const IntegrationsText = styled.p`
    margin-top: 50px;
    font-family: AvenirNext-Medium;
    font-size: ${({ size }) => (size ? size : '32px')};
    color: #ffffff;
    letter-spacing: -0.67px;
    line-height: 96px;
`;

const IntegrationsTextStarred = styled(IntegrationsText)`
    opacity: 0.5;
    font-size: 15px;
    letter-spacing: -0.31px;
`;

const DottedLine = styled.div`
    width: 150px;
    opacity: 0.34;
    border-top: 4px dotted #ffffff;
`;

const Integrations = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <PaddedContainer paddingTop="120px">
                <IntegrationsWrapper>
                    <IntegrationsCol>
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
            </PaddedContainer>
        </Bg>
    );
};

export default addTranslate(Integrations, content);
