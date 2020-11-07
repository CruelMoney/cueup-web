import styled from 'styled-components';
import { TeritaryButton } from './Blocks';

const NavMenuButton = styled(TeritaryButton)`
    text-align: left;
    color: #32325d;
    font-weight: 400;
    font-size: 16px;
    width: 100%;
    max-width: 100%;
    transition: none;
    border-radius: 12px;
    line-height: 24px;
    display: flex;
    align-items: center;

    > svg {
        margin-right: 0.5em;
        margin-left: -0.5em;
        padding: 0.15em;
        height: 24px;
        width: 24px;
        border-radius: 6px;
    }
`;

export default NavMenuButton;
