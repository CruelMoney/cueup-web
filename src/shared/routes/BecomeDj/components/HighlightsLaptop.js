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
    position: sticky;
    top: -82px;
    z-index: -1;
    @media only screen and (max-width: 685px) {
        position: sticky;
        top: 0px;
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

export default addTranslate(HighlightsLaptop, content);
