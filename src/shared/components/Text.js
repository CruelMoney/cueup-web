import React from 'react';
import styled, { css } from 'styled-components';
import { Col } from './Blocks';

export const StatUnit = styled.p`
    font-family: 'AvenirNext-DemiBold', Arial, Helvetica, sans-serif;
    font-size: 15px;
    color: ${({ white }) => (white ? 'rgba(255,255,255,0.6)' : '#98a4b3')};
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 0px;
    line-height: 1.2em;
`;
const StatValue = styled.p`
    font-family: 'AvenirNext-DemiBold', Arial, Helvetica, sans-serif;
    font-size: 15px;
    color: ${({ white }) => (white ? '#fff' : '#4d6480')};
    letter-spacing: 1px;
    margin-bottom: 0px;
    line-height: 1.2em;
`;

export const Stat = ({ label, value, style, ...props }) => (
    <Col style={style}>
        <StatValue {...props}>{value}</StatValue>
        <StatUnit {...props}>{label}</StatUnit>
    </Col>
);

export const SmallHeader = styled.h6`
    font-family: 'AvenirNext-DemiBold', Arial, Helvetica, sans-serif;
    font-size: 15px;
    line-height: 1.5em;
    color: #122b48;
`;

export const Title = styled.h3`
    font-family: 'AvenirNext-Bold', Arial, Helvetica, sans-serif;
    font-size: 18px;
    color: #122b48;
    text-align: left;
    position: relative;
    margin-bottom: ${({ largeMargin }) => (largeMargin ? '36px' : '24px')};
    &:after {
        content: '';
        width: 60px;
        border-bottom: 3px solid #50e3c2;
        color: #50e3c2;
        position: absolute;
        bottom: -15px;
        left: 0;
    }
`;

export const TitleClean = styled.h3`
    font-family: 'AvenirNext-Bold', Arial, Helvetica, sans-serif;
    font-size: 18px;
    color: #122b48;
    text-align: left;
    margin-bottom: 24px;
    ${({ center }) =>
        center &&
        css`
            text-align: center;
            margin: auto;
        `}
`;

export const Body = styled.p`
    font-size: 18px;
    color: ${({ white }) => (white ? '#fff' : '#4d6480')};
    line-height: 27px;
    letter-spacing: 0;
    ${({ opacity }) => opacity && `opacity: ${opacity};`}
    ${({ center }) =>
        center &&
        css`
            text-align: center;
        `}
`;
export const BodyBold = styled(Body)`
    font-family: 'AvenirNext-DemiBold', Arial, Helvetica, sans-serif;
    font-weight: 700;
`;

export const BodySmall = styled.p`
    font-size: 15px;
    color: #4d6480;
    line-height: 22.5px;
`;

export const InlineLink = styled.a`
    font-family: 'AvenirNext-DemiBold', Arial, Helvetica, sans-serif;
    font-weight: 700;
    color: #50e3c2;
    :hover {
        color: #50e3c299;
    }
    :visited {
        color: #50e3c2;
    }
`;

export const Citation = styled.blockquote`
    font-size: 18px;
    color: #98a4b3;
    padding: 0;
    margin: 0;
    border: none;
`;

const smallBoldStyle = css`
    font-family: ${({ demi }) => (demi ? 'AvenirNext-DemiBold' : 'AvenirNext-Bold')}, Arial,
        Helvetica, sans-serif;
    font-style: normal;
    font-size: 12px;
    line-height: 1.2em;
    color: #4d6480;
`;

export const SmallBold = styled.p`
    ${smallBoldStyle}
`;

export const Cite = styled.cite`
    ${smallBoldStyle}
    text-align: right;
    padding: 0;
    margin: 0;
    margin-top: 9px;
    border: none;
    &:before {
        content: '-';
        position: relative;
        color: #50e3c2;
        margin-right: 6px;
        font-size: 18px;
        line-height: 12px;
    }
`;

export const HeaderTitle = styled.h1`
    font-family: 'AvenirNext-Bold', Arial, Helvetica, sans-serif;
    font-size: 36px;
    color: #fff;
    margin-bottom: 0.3em;
    line-height: 1.2em;
    display: inline-block;
    position: relative;
    @media only screen and (max-width: 425px) {
        font-size: 30px;
        text-align: left;
        margin-bottom: 0;
        > * {
            display: none;
        }
    }
`;
