import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';

class MyNavlink extends Component {
    static defaultProps = {
        rounded: true,
    };

    render() {
        const {
            buttonLook,
            onClick,
            borderHover,
            children,
            label,
            to,
            rounded,
            important,
            userNavigation,
            ...rest
        } = this.props;

        return (
            <div onClick={onClick}>
                <NavLink
                    to={to}
                    className={'navLink ' + (borderHover ? 'borderHover' : '')}
                    activeClassName="active"
                    {...rest}
                >
                    {label ? label : children}
                </NavLink>
            </div>
        );
    }
}

export default MyNavlink;
