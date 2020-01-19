import React from 'react';
import styled from 'styled-components';
import addTranslate from '../../../components/higher-order/addTranslate';
import content from '../content.json';
import Laptop from './Laptop';
import Highlights from './Highlights';

const HighlightsLaptop = (props) => {
    return (
        <div>
            <Highlights />
            <Laptop />
        </div>
    );
};

export default addTranslate(HighlightsLaptop, content);
