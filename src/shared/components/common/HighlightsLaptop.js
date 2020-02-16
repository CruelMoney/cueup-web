import React from 'react';
import styled from 'styled-components';
import { Col } from 'components/Blocks';
import addTranslate from '../higher-order/addTranslate';
import Laptop from './Laptop';
import Highlights from './Highlights';

const Wrapper = styled(Col)`
    position: relative;
    @media only screen and (max-width: 425px) {
        flex-direction: column-reverse;
    }
`;
const HighlightsLaptop = () => {
    return (
        <Wrapper>
            <Highlights />
            <Laptop />
        </Wrapper>
    );
};

export default addTranslate(HighlightsLaptop);
