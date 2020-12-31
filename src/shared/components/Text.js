import React from 'react';
import styled, { css } from 'styled-components';
import { Col } from './Blocks';

const BaseText = css`
    color: ${({ white }) => (white ? '#fff' : '#122b48')};
    text-align: ${({ center }) => (center ? 'center' : 'left')};
    ${({ numberOfLines }) =>
        numberOfLines &&
        css`
            max-lines: ${numberOfLines};
            display: -webkit-box;
            -webkit-line-clamp: ${numberOfLines};
            -webkit-box-orient: vertical;
            overflow: hidden;
            max-height: ${numberOfLines * 1.5}em;
            word-wrap: anywhere;
        `}
`;

export const StatUnit = styled.p`
    font-size: 15px;
    color: ${({ white }) => (white ? 'rgba(255,255,255,0.6)' : '#98a4b3')};
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-bottom: 0px;
    line-height: 1.2em;
    font-weight: 600;
`;
const StatValue = styled.p`
    font-size: 15px;
    color: ${({ white }) => (white ? '#fff' : '#4d6480')};
    letter-spacing: 1px;
    margin-bottom: 0px;
    line-height: 1.2em;
    font-weight: 600;
`;

export const Stat = ({ label, value, style, ...props }) => (
    <Col style={style}>
        <StatValue {...props}>{value}</StatValue>
        <StatUnit {...props}>{label}</StatUnit>
    </Col>
);

export const SmallHeader = styled.h6`
    font-size: 15px;
    line-height: 1.5em;
    color: ${({ white }) => (white ? '#fff' : '#122b48')};
`;

export const Title = styled.h3`
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
    ${BaseText}
    font-size: ${({ small }) => (small ? '16px' : '18px')};
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
    font-weight: 600;
`;

export const BodySmall = styled.p`
    ${BaseText}
    font-size: 16px;
    color: #4d6480;
    line-height: 1.5em;
`;

export const InlineLink = styled.a`
    font-weight: 600;
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
    margin-bottom: 24px;
`;

const smallBoldStyle = css`
    font-weight: ${({ demi }) => (demi ? 600 : 700)};
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
    margin-left: 9px;
    border: none;
`;

export const HeaderTitle = styled.h1`
    font-size: 36px;
    color: ${({ dark }) => (dark ? 'inherit' : '#fff')};
    margin-bottom: 0.3em;
    line-height: 1.2em;
    display: inline-block;
    position: relative;
    @media only screen and (max-width: 425px) {
        font-size: 30px;
        margin-bottom: 0;
    }
    ${({ divider }) =>
        divider &&
        css`
            margin-bottom: 1.5em !important;
            :after {
                content: '';
                width: 60px;
                border-bottom: 3px solid #50e3c2;
                color: #50e3c2;
                position: absolute;
                bottom: -15px;
                left: 0;
            }
        `}
`;

export const PageTitle = styled.h1`
    font-size: 42px;
    font-weight: bold;
    white-space: pre-wrap;
    ${({ small }) =>
        small
            ? css`
                  font-size: 32px;
                  margin-bottom: 0.1em;
              `
            : ''}
    > span {
        display: block;
        font-weight: 500;
    }

    ${({ hideMobile }) =>
        hideMobile
            ? css`
                  @media screen and (max-width: 1000px) {
                      display: none;
                  }
              `
            : ''}
`;

export const H2 = styled.h2`
    ${BaseText}
    font-weight: bold;
    font-size: 48px;
    line-height: 1.15em;
    letter-spacing: -0.01em;
    margin-bottom: 0.8em;
    white-space: pre-wrap;
    ${({ small }) =>
        small
            ? css`
                  font-size: 32px;
                  font-weight: 600;
                  margin-bottom: 0.2em;
              `
            : ''}
    @media screen and (max-width: 480px) {
        font-size: 30px;
    }
`;

export const H3 = styled.h3`
    ${BaseText}
    font-weight: bold;
    font-size: 38px;
    line-height: 1.15em;
    letter-spacing: -0.01em;
    margin-bottom: 0.8em;
    white-space: pre-wrap;
    ${({ small }) =>
        small
            ? css`
                  font-size: 18px !important;
                  font-weight: 600;
                  margin-bottom: 0.4em;
              `
            : ''}
    @media screen and (max-width: 480px) {
        font-size: 24px;
    }
`;

export const TextAccent = styled.span`
    color: #00d1ff;
    text-align: ${({ center }) => (center ? 'center' : 'left')};
    font-size: max(18px, 0.31em);
    margin-bottom: 12px;
    font-weight: 600;
`;
