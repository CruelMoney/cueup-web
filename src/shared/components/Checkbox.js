import React, { useState } from 'react';
import styled from 'styled-components';
import { Label } from './FormComponents';

// Hide checkbox visually but remain accessible to screen readers.
// Source: https://polished.js.org/docs/#hidevisually
const HiddenCheckbox = styled.input.attrs({ type: 'checkbox' })`
    border: 0;
    clip: rect(0 0 0 0);
    clip-path: inset(50%);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
`;

const Icon = styled.svg`
    fill: #f6f8f9;
    stroke: #f6f8f9;
    stroke-width: 1px;
`;

export const StyledCheckbox = styled.div`
    display: inline-block;
    width: 24px;
    height: 24px;
    min-width: 24px;
    min-height: 24px;
    background: ${(props) => (props.checked ? '#50E3C2 !important' : '#F6F8F9')};
    border-radius: 3px;
    cursor: pointer;

    transition: all 150ms;

    ${Icon} {
        visibility: ${(props) => (props.checked ? 'visible' : 'hidden')};
    }
    :hover {
        background: ${(props) => (props.checked ? '#50E3C2 !important' : '#e9ecf0')};
    }
    ${HiddenCheckbox}:focus + & {
        box-shadow: inset 0 0 0 3px #50e3c2;
    }

    ${({ withBorder }) =>
        withBorder
            ? `
   box-shadow: inset 0 0 0 2px #50e3c2;
  `
            : ''}
`;

const CheckboxContainer = styled.div`
    display: flex;
`;

const Checkbox = ({ defaultValue, onChange, ...props }) => {
    const [checked, setChecked] = useState(defaultValue || false);

    const updateVal = (newVal) => {
        setChecked(newVal);
        onChange(newVal);
    };

    return (
        <DumbCheckbox
            onClick={() => {
                updateVal(!checked);
            }}
            checked={checked}
            {...props}
        />
    );
};

export const DumbCheckbox = ({
    className,
    onClick,
    checked,
    label,
    withBorder,
    style,
    ...props
}) => {
    return (
        <CheckboxContainer className={className} onClick={onClick} style={style}>
            <Label
                onClick={(e) => {
                    e.preventDefault();
                }}
                style={{ display: 'flex' }}
            >
                <HiddenCheckbox checked={checked} onChange={() => {}} {...props} />
                <StyledCheckbox checked={checked} withBorder={withBorder} onChange={() => {}}>
                    <Icon viewBox="0 0 24 24">
                        <path
                            d="M9.42794558,14.4124552 C9.1518032,14.4124552 8.92794558,14.6363128 8.92794558,14.9124552 L8.92794558,15.9326469 C8.92794558,16.2087893 9.1518032,16.4326469 9.42794558,16.4326469 L15.4279456,16.4326469 C15.704088,16.4326469 15.9279456,16.2087893 15.9279456,15.9326469 L15.9279456,4.9232442 C15.9279456,4.64710183 15.704088,4.4232442 15.4279456,4.4232442 L14.4561228,4.4232442 C14.1799804,4.4232442 13.9561228,4.64710183 13.9561228,4.9232442 L13.9561228,14.4124552 L9.42794558,14.4124552 Z"
                            transform="translate(12.427946, 10.427946) rotate(-315.000000) translate(-12.427946, -10.427946) "
                        />
                    </Icon>
                </StyledCheckbox>
                {label && <span style={{ marginLeft: '15px', top: '-6px' }}>{label}</span>}
            </Label>
        </CheckboxContainer>
    );
};

export default Checkbox;
