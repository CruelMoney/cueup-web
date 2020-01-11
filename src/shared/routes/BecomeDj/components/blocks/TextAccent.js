import React, { Component } from 'react';
import styled from 'styled-components';

export const TextAccent = styled.h3`
    color: #00d1ff;
    text-align: center;
    font-size: 15px;
    margin: ${({ margin }) => (margin ? margin : '0')};
`;
