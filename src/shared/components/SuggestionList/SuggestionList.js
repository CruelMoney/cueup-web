import { isBoolean } from 'util';
import React, { useState, useRef, forwardRef } from 'react';
import styled from 'styled-components';
import { Input } from '../FormComponents';
import { inputStyle } from '../Blocks';

const SuggestionList = forwardRef(
    (
        {
            suggestions: ogSuggestions = [], // can be either strings or {label, value}
            value,
            defaultValue,
            onChange,
            onBlur,
            onFocus,
            noShadow,
            forceHeight,
            disableInput,
            half,
            style,
            children,
            filter,
            footer,
            wrapperStyle,
            ...props
        },
        ref
    ) => {
        let suggestions = ogSuggestions;
        if (filter) {
            suggestions = suggestions.filter(filter);
        }

        const internalRef = useRef();
        const inputRef = ref || internalRef;

        const getDefaultValue = (v) => {
            if (!suggestions || !suggestions.length) {
                return v;
            }
            if (!suggestions[0].value) {
                return v;
            }
            return suggestions.find((s) => s.value === v);
        };

        const [internalValue, setInternalValue] = useState(getDefaultValue(value || defaultValue));
        const [focused, setFocused] = useState(false);
        const [suggestionCursor, setSuggestionCursor] = useState(-1);

        const handleChange = (v, wasSelected) => {
            setInternalValue(v);
            const selection = v ? v.value || v : null;
            onChange && onChange(selection, wasSelected);
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
            const isTab = keyCode == '9';

            if (isTab) {
                handleChange(suggestions[Math.max(suggestionCursor, 0)], true);
                setFocused(false);
                return false;
            }

            if (isEnter) {
                e.preventDefault();
                handleChange(suggestions[Math.max(suggestionCursor, 0)], true);
                setFocused(false);
                inputRef.current && inputRef.current.blur();
                return false;
            }

            if (arrowDown || arrowUp) {
                const max = suggestions.length - 1;
                e.preventDefault();
                setSuggestionCursor((i) => Math.max(0, Math.min(max, i + (arrowDown ? 1 : -1))));
                return false;
            }
        };

        let displayValue = internalValue;

        if (displayValue && displayValue.label) {
            displayValue = displayValue.label;
        }

        // hide caret
        if (disableInput) {
            style = {
                ...style,
                color: 'transparent',
                cursor: 'pointer',
                textShadow: '0 0 0 black',
            };
        }

        return (
            <Wrapper
                active={focused}
                onKeyDown={handleKeyPress}
                className={'suggestionList' + (half ? ' half' : '')}
                style={wrapperStyle}
            >
                <Input
                    ref={inputRef}
                    // errorOutside
                    type="text"
                    value={displayValue}
                    onChange={!disableInput && handleChange}
                    onFocus={handleFocus}
                    onBlur={handleBlur}
                    style={style}
                    aria-autocomplete="list"
                    aria-expanded="false"
                    autoComplete="off"
                    autoCorrect="off"
                    spellCheck="false"
                    role="combobox"
                    {...props}
                />
                {focused && suggestions.length > 0 && (
                    <List
                        noShadow={noShadow}
                        forceHeight={forceHeight}
                        topOffset={props.label ? 90 : 60}
                    >
                        {suggestions.map((s, idx) => (
                            <Suggestion
                                key={idx}
                                data-cy="suggestion-list-item"
                                active={suggestionCursor === idx}
                                onMouseEnter={() => setSuggestionCursor(idx)}
                                onMouseDown={() => handleChange(s, true)}
                            >
                                {s.label || s}
                            </Suggestion>
                        ))}
                        {footer}
                    </List>
                )}
                {children}
            </Wrapper>
        );
    }
);

export const SearchableSuggestionList = ({ suggestions, onBlur, onChange, onSave, ...props }) => {
    const [filter, setFilter] = useState();
    const [reset, setReset] = useState(false);
    let filteredSuggestions = suggestions;

    if (filter) {
        const lowered = filter.toLowerCase();
        filteredSuggestions = suggestions.filter((s) => {
            if (s.label) {
                return s.label.toLowerCase().includes(lowered);
            }
            return s.toLowerCase().includes(lowered);
        });
    }

    const changeHandler = (value, wasSelected) => {
        onChange && onChange(value);
        if (wasSelected) {
            onSave && onSave(value);
        } else {
            setFilter(value);
        }
    };

    const blurHandler = (e) => {
        setFilter(null);
        // check if exists in list
        if (!filteredSuggestions.length) {
            setReset((r) => !r);
            onSave && onSave(null);
        }
        onBlur && onBlur();
    };

    return (
        <SuggestionList
            key={reset}
            {...props}
            onChange={changeHandler}
            suggestions={filteredSuggestions}
            onBlur={blurHandler}
        />
    );
};

const Wrapper = styled.div`
    position: relative;
    z-index: ${({ active }) => (active ? 2 : 1)};
    display: block;
    margin-bottom: 30px;
    label,
    input {
        position: relative;
        z-index: 1;
        width: 100%;
        min-width: 100%;
        margin-right: 0;
        margin-bottom: 0;
    }
    > p {
        margin-top: 6px;
    }
`;

const List = styled.ul`
    position: absolute;
    top: -12px;
    left: -12px;
    right: -12px;
    font-size: 18px;
    margin: 0;
    padding: 0;
    background: white;
    overflow-y: scroll;
    box-shadow: ${({ noShadow }) => (noShadow ? 'none' : '0px 1px 4px 0px rgba(0, 0, 0, 0.3)')};
    height: ${({ forceHeight }) =>
        forceHeight ? (typeof forceHeight === Boolean ? '400px' : forceHeight + 'px') : 'auto'};
    border-radius: 4px;
    ${({ forceHeight }) => (forceHeight ? 'margin-top' : 'padding-top')}: ${({ topOffset }) =>
        topOffset}px;
`;

const Suggestion = styled.li`
    ${inputStyle};
    display: flex;
    align-items: center;
    padding: 9px 9px;
    margin: 0 12px;
    cursor: pointer;
    text-indent: 0;
    height: auto;
    width: calc(100% - 24px);
    box-sizing: border-box;
    background-color: ${({ active }) => (active ? ' #f6f8f9' : 'transparent')};
`;

export default SuggestionList;
