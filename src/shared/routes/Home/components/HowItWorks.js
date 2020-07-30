import React from 'react';
import styled from 'styled-components';
import HowItWorksCards from 'routes/HowItWorks/components/HowItWorksCards';
import { Container, Col } from 'components/Blocks';
import { H2, TextAccent } from 'components/Text';

const HowitworksSection = () => {
    return (
        <Wrapper>
            <Container>
                <Col center middle>
                    <TextAccent center>How it works</TextAccent>
                    <H2 center>
                        The easiest way to
                        <br />
                        book a DJ anywhere
                    </H2>
                </Col>
                <HowItWorksCards />
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
