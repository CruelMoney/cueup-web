import React from 'react';

const Checkmark = ({ color, ...props }) => (
    <svg width={12} height={11} viewBox="0 0 12 11" {...props}>
        <path
            d="M10.767.243L3.65 7.53 1.72 5.267c-.842-.73-2.17.122-1.566 1.215l2.29 3.965c.363.486 1.207.972 2.05 0 .363-.486 7.237-9.11 7.237-9.11.846-.973-.24-1.822-.962-1.094h-.002z"
            fill={color || '#FFF'}
            fillRule="evenodd"
        />
    </svg>
);

export default Checkmark;
