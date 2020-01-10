import React from 'react';
import styled from 'styled-components';
import { HeaderTitle, Body } from 'components/Text';
import { Container, Col, Row } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import GracefullImage from '../../../components/GracefullImage';
import { TextAccent } from '../components/blocks/TextAccent';
import { Title } from '../components/blocks/Title';

const Bg = styled.div`
    width: 100vw;
    height: 100vh;
    background-color: #0b1b2d;
`;

const Integrations = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                {/* <Row> */}
                <TextAccent>{translate('become-dj.integrations.integrations')}</TextAccent>

                {/* </Row> */}
            </Container>
        </Bg>
    );
};

export default addTranslate(Integrations, content);
