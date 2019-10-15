import React, { forwardRef } from 'react';

const RegistrationElement = forwardRef(({ label, text, children, active, count }, ref) => {
    const styles = {
        base: {
            marginBottom: '20px',
            marginTop: '-35px',
            opacity: active ? '1' : '0.2',
        },

        label: {
            display: 'block',
            marginBottom: '0.5em',
            fontWeight: '300',
            fontSize: '30px',
        },

        paragraph: {
            fontSize: '14px',
        },
    };

    return (
        <div style={styles.base} ref={ref}>
            <h2>{label}</h2>
            <p>
                {text}
                {count}
            </p>
            {children}
        </div>
    );
});

export default RegistrationElement;
