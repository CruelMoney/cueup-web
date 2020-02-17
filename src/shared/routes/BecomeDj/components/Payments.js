import React from 'react';
import styled from 'styled-components';
import { Container } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import PaymentCards from '../../../components/common/PaymentCards';

const Bg = styled.div`
    display: flex;
    justify-content: center;
    width: 100%;
    order: 6;
    margin-bottom: -84px;
`;

const Payments = (props) => {
    const { translate, currentLanguage } = props;
    return (
        <Bg>
            <Container>
                <PaymentCards />
            </Container>
        </Bg>
    );
};

export default addTranslate(Payments);
