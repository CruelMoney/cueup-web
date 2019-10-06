import React, { useState } from 'react';
import { SecondaryButton } from 'components/Blocks';
import Checkmark from 'assets/Checkmark';

const ToggleButton = ({ label, labelToggled, onClick, disabled, active, ...props }) => {
    const [internalToggled, setToggled] = useState(active);

    const toggled = active || internalToggled;

    const handleClick = () => {
        if (disabled) {
            return;
        }
        const newToggle = !internalToggled;
        setToggled(newToggle);
        onClick(newToggle);
    };

    return (
        <SecondaryButton
            {...props}
            type="button"
            muted
            flex
            style={{ width: '100%', flex: 1, maxWidth: '100%', minWidth: '0px' }}
            active={toggled}
            onClick={handleClick}
        >
            {toggled ? (labelToggled ? labelToggled : label) : label}
            {toggled && (
                <Checkmark
                    style={{
                        left: '6px',
                        width: '15px',
                        height: '15px',
                        position: 'relative',
                        marginRight: '-15px',
                    }}
                    color="#50e3c2"
                />
            )}
        </SecondaryButton>
    );
};

export default ToggleButton;
