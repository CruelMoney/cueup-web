import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { NavLink as Link } from 'react-router-dom';

class ButtonLinkGlow extends Component {
    static defaultProps = {
        rounded: true,
    };

    constructor(props) {
        super(props);

        this.color = props.color
            ? props.color
            : props.dangerous
            ? '#F44336'
            : this.context.color
            ? this.context.color
            : '';
    }

    className = () => {
        let className = this.props.className ? 'button ' + this.props.className : 'button';
        if (this.props.active) {
            className += ' active';
        }
        if (this.props.isLoading) {
            className += ' loading';
        }
        if (this.props.succes) {
            className += ' succes';
        }
        if (this.props.dangerous) {
            className += ' dangerous';
        }
        if (this.props.glow) {
            className += ' glow';
        }

        return className;
    };

    style = (active) => {
        return {
            borderRadius: this.props.rightRounded
                ? '0px 13px 13px 0px'
                : this.props.leftRounded
                ? '13px 0px 0px 13px'
                : this.props.rounded
                ? '13px 13px 13px 13px'
                : '0px 0px 0px 0px',
            backgroundColor: this.props.isLoading
                ? 'transparent'
                : active
                ? this.color
                : this.props.active
                ? this.color
                : this.props.succes
                ? this.color
                : null,
            borderWidth: '2px',
            borderColor: this.props.isLoading
                ? 'transparent'
                : active
                ? this.color
                : this.props.active
                ? this.color
                : this.props.succes
                ? this.color
                : null,
            color: active ? 'white' : this.props.active ? 'white' : null,
            fill: active ? 'white' : this.props.active ? 'white' : null,
            width: '236px',
            height: '50px',
            display: 'flex',
            boxShadow: '0px 0px 45px 0px rgba(0, 209, 255, 0.75)',
        };
    };

    wrapperStyle = () => {
        return {
            textAlign: 'center',
            borderColor: this.props.dangerous ? '#F44336' : this.color,
            color: this.props.dangerous ? '#F44336' : this.color,
            fill: this.props.dangerous ? '#F44336' : this.color,
            // boxShadow: '0 0px 20px 0px ' + (this.props.dangerous ? '#F44336' : this.color),
            backgroundColor: this.props.dangerous ? '#F44336' : this.color,
        };
    };

    render() {
        return (
            <div className="button-wrapper" style={this.wrapperStyle()}>
                <Link
                    style={this.style(false)}
                    activeStyle={this.style(true)}
                    to={this.props.to}
                    className={this.className()}
                    activeClassName="active"
                    onClick={this.props.onClick}
                    disabled={this.props.disabled || this.props.succes || this.props.isLoading}
                >
                    {this.props.children}
                </Link>
            </div>
        );
    }
}

ButtonLinkGlow.contextTypes = {
    color: PropTypes.string,
};

export default ButtonLinkGlow;
