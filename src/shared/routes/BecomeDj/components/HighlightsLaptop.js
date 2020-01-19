import React from 'react';
import styled from 'styled-components';
import { Col } from 'components/Blocks';
import addTranslate from '../../../components/higher-order/addTranslate';
import Laptop from './Laptop';
import Highlights from './Highlights';

const Wrapper = styled(Col)`
    @media only screen and (max-width: 375px) {
        flex-direction: column-reverse;
    }
`;
const HighlightsLaptop = (props) => {
    return (
        <Wrapper>
            <Highlights />
            <Laptop />
        </Wrapper>
    );
};

export default addTranslate(HighlightsLaptop);
