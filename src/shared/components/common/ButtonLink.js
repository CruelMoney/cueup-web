import React from 'react';
import { NavLink as Link } from 'react-router-dom';
import { PrimaryButton } from 'components/Blocks';

const ButtonLink = ({ invert, shadow, to, onClick, children, style }) => {
    return (
        <Link to={to} activeClassName="active" onClick={onClick}>
            <PrimaryButton shadow={shadow} invert={invert} style={style}>
                {children}
            </PrimaryButton>
        </Link>
    );
};

export default ButtonLink;
