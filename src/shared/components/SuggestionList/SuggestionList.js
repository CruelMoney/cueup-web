import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../FormComponents';
import { inputStyle } from '../Blocks';

const SuggestionList = ({ suggestions = [], value, onChange, onBlur, onFocus, ...props }) => {
    const [internalValue, setInternalValue] = useState(value || '');

    const [focused, setFocused] = useState(false);

    const handleChange = (v) => {
        setInternalValue(v);
        onChange && onChange(v);
    };

    const handleBlur = () => {
        onBlur && onBlur();
        setFocused(false);
    };

    const handleFocus = () => {
        setFocused(true);
        onFocus && onFocus();
    };

    return (
        <Wrapper>
            <Input
                type="text"
                value={internalValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                {...props}
            />
            {focused && suggestions.length > 0 && (
                <List>
                    {suggestions.map((s, idx) => (
                        <Suggestion key={idx} onMouseDown={() => handleChange(s)}>
                            {s}
                        </Suggestion>
                    ))}
                </List>
            )}
        </Wrapper>
    );
};

const Wrapper = styled.div`
    position: relative;
    label,
    input {
        position: relative;
        z-index: 1;
    }
`;

const List = styled.ul`
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    margin: 0;
    padding: 0;
    padding-top: 95px;
    background: white;
    box-shadow: 0px 1px 4px 0px rgba(0, 0, 0, 0.3);
    border-radius: 4px;
`;

const Suggestion = styled.li`
    ${inputStyle};
    background: transparent;
    display: flex;
    align-items: center;
    padding: 9px 21px;
    cursor: pointer;
    text-indent: 0;
    height: auto;
    width: 100%;
    box-sizing: border-box;
    &:hover,
    &:focus {
        background-color: #f6f8f9;
    }
`;

export default SuggestionList;
