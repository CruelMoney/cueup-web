import React, { useEffect, useRef } from 'react';
import './index.css';

const TextInput = ({ onSave, ...props }) => {
    const input = useRef();

    useEffect(() => {
        const ref = input.current;

        ref.focus();

        const saveOnEnter = function (event) {
            // "Enter"
            if (event.keyCode === 13) {
                event.preventDefault();
                ref.blur();
            }
        };

        ref.addEventListener('keyup', saveOnEnter);

        return () => ref.removeEventListener('keyup', saveOnEnter);
    }, []);

    return (
        <input
            ref={input}
            onBlur={() => onSave(input.current.value)}
            className="text-input"
            {...props}
        />
    );
};

export default TextInput;
