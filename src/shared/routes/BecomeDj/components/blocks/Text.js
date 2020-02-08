import React, { Component } from 'react';
import styled from 'styled-components';

export const GrayText = styled.p`
    font-size: 20px;
    color: #4d6480;
    line-height: 34px;
    @media only screen and (max-width: 768px) {
        text-align: ${({ mobileTextAlign }) => (mobileTextAlign ? mobileTextAlign : 'center')};
        margin-top: 20px;
    }
`;

export const Header = styled.h2`
    font-size: 64px;
    color: #122b48;
    line-height: 1.2em;
    margin-bottom: 0.3em;
    white-space: pre-wrap;
    @media only screen and (max-width: 425px) {
        text-align: ${({ mobileTextAlign }) => (mobileTextAlign ? mobileTextAlign : 'center')};
        font-size: 32px;
    }
    ${({ white }) => (white ? 'color: #fff;' : '')}
    ${({ center }) => (center ? 'text-align: center;' : '')}
    ${({ small }) => (small ? 'font-size: 48px;' : '')}
`;
