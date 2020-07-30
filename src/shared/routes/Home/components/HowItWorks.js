import React from 'react';
import styled from 'styled-components';
import HowItWorksCards from 'routes/HowItWorks/components/HowItWorksCards';
import { Container, Col } from 'components/Blocks';
import { H2, TextAccent } from 'components/Text';

const HowitworksSection = () => {
    return (
        <Wrapper>
            <Container>
                <Col>
                    <TextAccent center>How it works</TextAccent>
                    <H2>
                        The easiest way to
                        <br /> book a DJ anywhere
                    </H2>
                </Col>
                <div style={{ marginTop: 30 }}>
                    <HowItWorksCards />
                </div>
            </Container>
        </Wrapper>
    );
};

const Wrapper = styled.section`
    background-color: #f7f9fc;
    display: flex;
    align-items: center;
    padding: 60px 0;
`;

export default HowitworksSection;