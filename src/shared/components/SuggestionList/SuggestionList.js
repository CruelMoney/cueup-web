import React, { useState } from 'react';
import styled from 'styled-components';
import { Input } from '../FormComponents';
import { inputStyle } from '../Blocks';

const SuggestionList = ({
    suggestions = [],
    value,
    defaultValue,
    onChange,
    onBlur,
    onFocus,
    noShadow,
    ...props
}) => {
    const [internalValue, setInternalValue] = useState(value || defaultValue);
    const [focused, setFocused] = useState(false);
    const [suggestionCursor, setSuggestionCursor] = useState(-1);

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

    const handleKeyPress = (e) => {
        e = e || window.event;

        const keyCode = e.keyCode || e.which;
        const arrowDown = keyCode == '40';
        const arrowUp = keyCode == '38';
        const isEnter = keyCode == '13';

        if (isEnter) {
            e.preventDefault();
            handleChange(suggestions[suggestionCursor]);
            setFocused(false);
            return false;
        }

        if (arrowDown || arrowUp) {
            const max = suggestions.length - 1;
            e.preventDefault();
            setSuggestionCursor((i) => Math.max(0, Math.min(max, i + (arrowDown ? 1 : -1))));
            return false;
        }
    };

    return (
        <Wrapper onKeyDown={handleKeyPress}>
            <Input
                type="text"
                value={internalValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                blurOnEnter={false}
                {...props}
            />
            {focused && suggestions.length > 0 && (
                <List noShadow={noShadow}>
                    {suggestions.map((s, idx) => (
                        <Suggestion
                            key={idx}
                            active={suggestionCursor === idx}
                            onMouseEnter={() => setSuggestionCursor(idx)}
                            onMouseDown={() => handleChange(s)}
                        >
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
    box-shadow: ${({ noShadow }) => (noShadow ? 'none' : '0px 1px 4px 0px rgba(0, 0, 0, 0.3)')};
    border-radius: 4px;
`;

const Suggestion = styled.li`
    ${inputStyle};
    display: flex;
    align-items: center;
    padding: 9px 21px;
    cursor: pointer;
    text-indent: 0;
    height: auto;
    width: 100%;
    box-sizing: border-box;
    background-color: ${({ active }) => (active ? ' #f6f8f9' : 'transparent')};
`;

export default SuggestionList;
