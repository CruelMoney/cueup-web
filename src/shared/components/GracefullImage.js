import React from 'react';
import styled from 'styled-components';

const StyledImg = styled.img`
    display: none;
    color: transparent;
    &[src] {
        display: block;
    }
`;

const GracefullImage = ({ ...props }) => {
    return (
        <StyledImg loading="lazy" onError={(e) => (e.target.style.display = 'none')} {...props} />
    );
};

export const GracefullPicture = ({ children, style }) => {
    return (
        <div
            style={{
                backgroundColor: '#EFF2F5',
                color: 'transparent',
                ...style,
            }}
        >
            <picture style={style}>{children}</picture>
        </div>
    );
};

export default GracefullImage;
