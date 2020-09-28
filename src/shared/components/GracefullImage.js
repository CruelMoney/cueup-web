import React from 'react';
import styled from 'styled-components';

const StyledImg = styled.img`
    color: transparent;
`;

const GracefullImage = ({ ...props }) => {
    return <StyledImg loading="lazy" {...props} />;
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
