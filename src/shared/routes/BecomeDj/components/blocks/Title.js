import React, { Component } from 'react';
import styled from 'styled-components';

export const Title = styled.h1`
    color: #fff;
    margin-bottom: 0.3em;
    display: inline-block;
    position: relative;
    font-size: 72px;
    letter-spacing: -1.5px;
    text-align: center;
    line-height: 72px;
    @media only screen and (max-width: 425px) {
        font-size: 42px;
        line-height: 45px;
        > * {
            display: none;
        }
    }
`;
