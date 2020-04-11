import React from 'react';
import './index.css';

const ToggleSwitch = ({ name, label, checked, small, ...props }) => {
    return (
        <div className={'tgl-wrapper' + (small ? ' small ' : '')}>
            <input
                id={name}
                type="checkbox"
                className="tgl tgl-light"
                checked={checked}
                {...props}
            />
            <label className="tgl-btn" htmlFor={name} />
            <label htmlFor={name} className="toggle-label">
                {label}
            </label>
        </div>
    );
};

export default ToggleSwitch;
