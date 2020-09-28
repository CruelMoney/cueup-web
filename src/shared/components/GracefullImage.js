import React from 'react';
import styled from 'styled-components';

const StyledImg = styled.img`
    color: transparent;
`;

const GracefullImage = ({ src, style, alt, animate, ...props }) => {
    return (
        <StyledImg src={src} style={style} loading="lazy" alt={alt} animate={animate} {...props} />
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
