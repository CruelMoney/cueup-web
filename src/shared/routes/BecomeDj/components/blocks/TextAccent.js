import styled from 'styled-components';

export const TextAccent = styled.h3`
    color: #00d1ff;
    text-align: ${({ center }) => (center ? 'center' : 'left')};
    font-size: 15px;
    margin-bottom: 12px;
`;

export const ResponsiveTextAccent = styled(TextAccent)`
    @media only screen and (max-width: 768px) {
        text-align: center;
        margin-top: 30px;
    }
`;
