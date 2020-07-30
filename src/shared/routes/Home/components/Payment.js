import React from 'react';
import styled from 'styled-components';

import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';

import { SubTitle } from 'routes/BecomeDj/components/SubTitle';
import { Container, Col } from 'components/Blocks';
import { H2 } from 'components/Text';

const Bg2 = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 400px;
    margin-bottom: -340px;
`;

const PaymentSection = () => {
    return (
        <Bg2>
            <Container>
                <Col>
                    <TextAccent center>PAYMENT</TextAccent>
                    <H2 white center>
                        Money back
                        <br />
                        guarantee
                    </H2>
                    <SubTitle white>
                        If a DJ cancels on you, we have your back and will immediately refund all
                        the money. We'll then make an extensive effort to find you a new DJ.
                    </SubTitle>
                </Col>
            </Container>
        </Bg2>
    );
};

export default PaymentSection;
