import React, { Component } from 'react';
import styled from 'styled-components';

export const GrayText = styled.p`
    margin-top: 20px;
    font-family: AvenirNext-Regular;
    font-size: 20px;
    color: #4d6480;
    line-height: 34px;
    @media only screen and (max-width: 685px) {
        text-align: ${({ mobileTextAlign }) => (mobileTextAlign ? mobileTextAlign : 'center')};
        margin-top: 20px;
    }
`;
