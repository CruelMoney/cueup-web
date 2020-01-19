import React, { Component } from 'react';
import styled from 'styled-components';

export const GrayText = styled.p`
    font-family: 'AvenirNext-Regular';
    font-size: 20px;
    color: #4d6480;
    line-height: 34px;
    @media only screen and (max-width: 685px) {
        text-align: ${({ mobileTextAlign }) => (mobileTextAlign ? mobileTextAlign : 'center')};
        margin-top: 20px;
    }
`;

export const Header = styled.h2`
    font-size: 64px;
    color: #122b48;
    line-height: 1em;
    margin-bottom: 0.3em;
    @media only screen and (max-width: 685px) {
        text-align: ${({ mobileTextAlign }) => (mobileTextAlign ? mobileTextAlign : 'center')};
        font-size: 32px;
    }
    ${({ white }) => (white ? 'color: #fff;' : '')}
    ${({ center }) => (center ? 'text-align: center;' : '')}
    ${({ small }) => (small ? 'font-size: 60px;' : '')}
`;
