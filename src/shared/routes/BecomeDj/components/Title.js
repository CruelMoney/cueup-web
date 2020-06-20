import styled from 'styled-components';

export const Title = styled.h1`
    color: ${({ blue }) => (blue ? '#122b48' : '#fff')};
    margin-bottom: 0.3em;
    ${({ margin }) => (margin ? 'margin: ' + margin : '')};
    display: inline-block;
    position: relative;
    white-space: pre-line;
    font-size: ${({ size }) => (size ? size : '72px')};
    line-height: ${({ line }) => (line ? line : '72px')};
    text-align: ${({ left }) => (left ? 'left' : 'center')};
    @media only screen and (max-width: 685px) {
        font-size: ${({ size }) => (size ? size : '42px')};
        line-height: ${({ line }) => (line ? line : '45px')};
        > * {
            display: none;
        }
    }
`;

export default Title;
