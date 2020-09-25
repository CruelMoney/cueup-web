import styled from 'styled-components';
import { Label } from 'components/FormComponents';

export const HeroCard = styled.div`
    padding: 1.5em;
    background-color: #fff;
    border-radius: 20px;
    box-shadow: 0 6px 21px 0 rgba(18, 43, 72, 0.2);
    position: relative;
    z-index: 1;
    max-width: 450px;
    display: inline-block;
    margin: auto 0;
    @media only screen and (max-width: 744px) {
        max-width: 100%;
        box-shadow: none;
        padding: 0;
        width: 100% !important;
    }
`;

export const StyledLabelComponent = styled.div`
    border: 1px solid #e9ecf0;
    border-radius: 8px;
    margin-top: 6px;
    display: flex;
    align-items: center;
    position: relative;
    label,
    ${Label} {
        flex: 1;
        min-width: 0;
        color: #32325d;
        font-weight: 600;
        letter-spacing: 0.08em;
        font-size: 10px;
        margin-left: 9px;
        margin-top: 8px;
        margin-bottom: 0px;

        > input,
        > button {
            font-size: 1.6em;
            margin: 0 -9px;
            margin-top: -4px;
            background-color: transparent;
            padding-left: 0px;
            text-align: left;
            justify-content: flex-start;
        }
        .empty {
            color: #98a4b3;
        }
    }
    .divider {
        width: 1px;
        background-color: #e9ecf0;
        height: 40px;
    }
    ul {
        top: -12px;
        left: -12px;
        right: -12px;
        padding-top: 4em;
        box-shadow: none;
        border: 1px solid #e9ecf0;
        border-radius: 8px;
    }
    .powered-by-google {
        top: 0.7em !important;
        display: flex;
        right: 0.7em !important;
    }
`;
