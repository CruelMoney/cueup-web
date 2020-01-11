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

const Bg = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #0b1b2d;
`;

const HalfCol = styled(Col)`
    width: 45%;
    align-self: flex-start;
`;

const IntegrationsText = styled.p`
    margin-top: 50px;
    font-family: AvenirNext-Medium;
    font-size: 32px;
    color: #ffffff;
    letter-spacing: -0.67px;
    line-height: 96px;
`;

const Integrations = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <PaddedContainer paddingTop="120px">
                <HalfCol>
                    <TextAccent margin="0 0 20px 0">
                        {translate('become-dj.integrations.integrations')}
                    </TextAccent>
                    <Title left size="64px" line="64px" spacing="-1.33px">
                        {translate('become-dj.integrations.combine-content-&-sell-yourself')}
                    </Title>
                    <IntegrationsText>
                        {translate('become-dj.integrations.instagram')} <br />
                        {translate('become-dj.integrations.soundcloud')} <br />
                        {translate('become-dj.integrations.testimonials')} <br />
                        {translate('become-dj.integrations.mixcloud')} <br />
                        {translate('become-dj.integrations.and-more')} <br />
                    </IntegrationsText>
                </HalfCol>
            </PaddedContainer>
        </Bg>
    );
};

export default addTranslate(Integrations, content);
