import React, { Component } from 'react';
import PropTypes from 'prop-types';

class ToggleOptions extends Component {
    static propTypes = {
        name: PropTypes.string.isRequired,
        children: PropTypes.node,
        value: PropTypes.string,
        glued: PropTypes.bool,
        disabled: PropTypes.bool,
    };

    handleButtonPress = (value) => {
        this.props.onChange(value);
    };

    renderChildren = (props) => {
        let count = 0;
        const length = props.children.length;
        return React.Children.map(props.children, (child) => {
            const active = props.value === child.props.name;
            count += 1;
            //Creating glued look
            if (props.glued) {
                switch (count) {
                    case 1:
                        return React.cloneElement(child, {
                            active: active,
                            onClick: this.handleButtonPress,
                            leftRounded: true,
                            disabled: this.props.disabled,
                        });
                    case length:
                        return React.cloneElement(child, {
                            active: active,
                            onClick: this.handleButtonPress,
                            rightRounded: true,
                            disabled: this.props.disabled,
                        });
                    default:
                        return React.cloneElement(child, {
                            active: active,
                            onClick: this.handleButtonPress,
                            rounded: false,
                            disabled: this.props.disabled,
                        });
                }
            } else {
                return React.cloneElement(child, {
                    active: active,
                    onClick: this.handleButtonPress,
                    disabled: this.props.disabled,
                });
            }
        });
    };

    render() {
        let children = this.renderChildren(this.props);
        children = children.map((el, i) => <td key={i}>{el}</td>);

        if (this.props.glued) {
            return (
                <div>
                    <div className="glued toggle-options">
                        <div style={{ display: 'flex', flexDirection: 'row', flexWrap: 'wrap' }}>
                            {this.renderChildren(this.props).map((el, i) => (
                                <div className="gluedButton" key={i}>
                                    {el}
                                </div>
                            ))}
                        </div>
                    </div>
                    {this.props.errors && this.props.errors.length ? (
                        <div className="errors">
                            {this.props.errors.map((error, i) => (
                                <p key={i}>{error}</p>
                            ))}
                        </div>
                    ) : null}
                </div>
            );
        }
        return (
            <div>
                <div className="toggle-options">
                    <table>
                        <tbody>
                            <tr>{children}</tr>
                        </tbody>
                    </table>
                </div>

                {this.props.errors && this.props.errors.length ? (
                    <div style={{ marginTop: '10px' }} className="errors">
                        {this.props.errors.map((error, i) => (
                            <p className="error" key={i}>
                                {error}
                            </p>
                        ))}
                    </div>
                ) : null}
            </div>
        );
    }
}

export default ToggleOptions;
export { ToggleOptions as DisconnectedToggleOptions };
