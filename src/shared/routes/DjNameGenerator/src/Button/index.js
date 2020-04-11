import React from 'react';
import './index.css';

const Button = ({ children, ...props }) => {
    return (
        <button className="btn glow" {...props}>
            {children}
        </button>
    );
};

export default Button;
