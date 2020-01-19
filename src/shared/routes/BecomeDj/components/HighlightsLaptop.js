import React from 'react';
import styled from 'styled-components';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import Laptop from './Laptop';
import Highlights from './Highlights';

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    order: 2;
`;

const HighlightsLaptop = (props) => {
    return (
        <Wrapper>
            <Highlights />
            <Laptop />
        </Wrapper>
    );
};

export default addTranslate(HighlightsLaptop, content);
