import React from 'react';
import styled, { css } from 'styled-components';
import { Col, Row } from './Blocks';
import { BodyBold, Body } from './Text';

const RadioSelect = ({ options, chosen, setChosen }) => {
    return (
        <div style={{ marginBottom: '30px' }}>
            {options.map(({ value, ...props }) => (
                <MethodButton
                    key={value}
                    checked={chosen === value}
                    onClick={() => setChosen(value)}
                    {...props}
                />
            ))}
        </div>
    );
};

export const MethodButton = ({ title, description, checked, onClick, withIndicator = true }) => {
    return (
        <MethodWrapper onClick={onClick}>
            {withIndicator && <RadioIndicator checked={checked} />}
            <Col>
                <BodyBold bold>{title}</BodyBold>
                <Body>{description}</Body>
            </Col>
        </MethodWrapper>
    );
};

const RadioIndicator = styled.div`
    height: 25px;
    width: 25px;
    min-width: 25px;
    min-height: 25px;
    border-radius: 25px;
    border: 3px solid #98a4b3;
    display: inline-block;
    margin-right: 1em;
    margin-top: 0.2em;
    position: relative;
    padding: 0;
    display: flex;
    justify-content: center;
    align-items: center;
    ${({ checked }) =>
        checked &&
        css`
            border-color: #31daff;
            &:after {
                position: absolute;
                content: '';
                height: 13px;
                width: 13px;
                background: #31daff;
                border-radius: 100%;
            }
        `}
`;

const MethodWrapper = styled(Row)`
    background-color: #f6f8f9;
    padding: 1em;
    border-radius: 6px;
    cursor: pointer;
    &:hover {
        background-color: #e9ecf0;
    }
    &:nth-child(2) {
        margin-top: 15px;
    }
`;

export default RadioSelect;
