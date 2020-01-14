import React, { Component } from 'react';
import styled from 'styled-components';

export const TextAccent = styled.h3`
    color: #00d1ff;
    text-align: ${({ center }) => (center ? 'center' : 'left')};
    font-size: 15px;
    margin: ${({ margin }) => (margin ? margin : '0')};
`;

export const ResponsiveTextAccent = styled(TextAccent)`
    @media only screen and (max-width: 685px) {
        text-align: center;
        margin-top: 30px;
    }
`;
