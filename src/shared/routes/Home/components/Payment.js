import React from 'react';
import styled from 'styled-components';

import { NavLink } from 'react-router-dom';
import { TextAccent } from 'routes/BecomeDj/components/blocks/TextAccent';

import { SubTitle } from 'routes/BecomeDj/components/SubTitle';
import { Container, Col, ReadMore } from 'components/Blocks';
import { H2 } from 'components/Text';

const Bg2 = styled.div`
    background-image: radial-gradient(50% 58% at 50% 33%, #122b48 12%, #0b1b2d 90%);
    z-index: -10;
    padding: 80px 0;
    display: flex;
    flex-direction: column;
    justify-content: center;
    padding-bottom: 160px;
    margin-bottom: -80px;
`;

const PaymentSection = () => {
    return (
        <Bg2>
            <Container>
                <Col style={{ textAlign: 'center' }}>
                    <TextAccent center>Payment</TextAccent>
                    <H2 white center>
                        Money back
                        <br />
                        guarantee
                    </H2>
                    <SubTitle white>
                        If you are not satisfied with the performance, we'll refund you. If the DJ
                        cancels on you, we'll refund you - and make an extensive effort to find you
                        a new DJ.
                    </SubTitle>
                    <a
                        style={{ marginTop: 24 }}
                        target="_blank"
                        rel="noreferrer noopener"
                        href="https://cueup.zendesk.com/hc/en-us/articles/360017164300"
                    >
                        <ReadMore center white size="18px" uppercase={false}>
                            Read more
                        </ReadMore>
                    </a>
                </Col>
            </Container>
        </Bg2>
    );
};

export default PaymentSection;
