import React from 'react';
import styled from 'styled-components';

import lineSvg from '../../assets/line.svg';

const Pattern = styled.div`
    background-image: url(${lineSvg});
    background-size: 23px 23px;
    height: 270px;
    width: 200px;
    position: absolute;
    @media screen and (max-width: 425px) {
        display: none;
    }
`;

export default Pattern;
