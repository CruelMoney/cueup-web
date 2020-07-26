import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { Body } from 'components/Text';

const RegistrationElement = forwardRef(
    ({ label, text, children, active, count, ...props }, ref) => {
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
            <div style={styles.base} ref={ref} {...props}>
                <HeaderLabel>{label}</HeaderLabel>
                <Body style={{ marginTop: 12, marginBottom: 12 }}>
                    {text}
                    {count}
                </Body>
                {children}
            </div>
        );
    }
);

const HeaderLabel = styled.h2`
    font-size: 30px;
    margin-top: 5px;
    @media screen and (max-width: 900px) {
        margin-left: 30px;
    }
`;

export default RegistrationElement;
