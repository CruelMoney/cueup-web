import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from '../FormComponents';
import connectToForm from '../higher-order/connectToForm';

class MyTextField extends Component {
    displayName = 'Textfield';

    static defaultProps = {
        type: 'string',
        validate: [],
    };

    onChange = (e) => {
        const value = e.target.value;
        this.props.onChange(value);
    };

    render() {
        const stylesBig = {
            textarea: {
                height: '70px',
                marginTop: '-10px',
            },

            input: {
                fontSize: '22px',
                color: '#32325d',
                fontFamily: 'AvenirNext-Regular',
                letterSpacing: this.props.type === 'password' ? '4px' : 0,
            },
            underlineStyle: {
                borderColor: this.context.textColor
                    ? this.context.textColor
                    : this.context.color
                    ? this.context.color
                    : '#31daff',
            },
            hint: {
                bottom: '23px',
                fontSize: '22px',
                color: 'rgba(187,187,187,0.5)',
                fontFamily: 'AvenirNext-Regular',
            },
            error: {
                fontFamily: 'AvenirNext-Regular',
            },
        };
        const stylesNormal = {
            textarea: {
                height: '30px',
                marginBottom: '5px',
            },
            input: {
                fontSize: '14px',
                color: '#32325d',
                fontFamily: 'AvenirNext-Regular',
                top: '0',
                marginTop: '0px',
                marginBottom: '5px',
                opacity: '1',
                letterSpacing: this.props.type === 'password' ? '4px' : 0,
            },
            underlineStyle: {
                borderColor: this.context.color || '#31daff',
                bottom: '0',
            },
            underlineNormalStyle: {
                bottom: '0',
            },
            hint: {
                fontSize: '14px',
                color: '#BBBBBB',
                fontFamily: 'AvenirNext-Regular',
                bottom: '0',
            },
            error: {
                fontFamily: 'AvenirNext-Regular',
                fontSize: '14px',
            },
            floatingLabelStyle: {
                fontFamily: 'AvenirNext-Medium',
                fontSize: '16px',
                fontWeight: '500',
                lineHeight: '22px',
                color: '#4A4A4A',
                top: '6',
            },
            underlineDisabledStyle: {
                borderWidth: ' 0px 0px 0px',
                borderStyle: 'solid solid',
                borderColor: 'rgb(224, 224, 224)',
            },
        };
        const styles = this.props.big ? stylesBig : stylesNormal;

        let className = 'text-field';
        className += this.props.disabled ? ' disabled' : '';
        return (
            <div
                className={className}
                style={{
                    pointerEvents: this.props.disabled ? 'none' : 'auto',
                }}
            >
                <Input
                    placeholder=""
                    value={this.props.value || undefined}
                    name={this.props.name}
                    maxLength={this.props.maxLength}
                    style={styles.textarea}
                    inputStyle={styles.input}
                    hintStyle={styles.hint}
                    underlineDisabledStyle={styles.underlineDisabledStyle}
                    underlineFocusStyle={styles.underlineStyle}
                    underlineStyle={styles.underlineNormalStyle}
                    type={this.props.type}
                    floatingLabelText={this.props.floatingLabelText}
                    floatingLabelStyle={styles.floatingLabelStyle}
                    fullWidth={this.props.fullWidth || true}
                    hintText={!this.props.initialValue ? this.props.placeholder : undefined}
                    onChange={(e) => this.onChange(e)}
                    onBlur={this.props.onBlur}
                    defaultValue={this.props.initialValue}
                    errorText={
                        this.props.errors ? (
                            this.props.errors.length ? (
                                <div
                                    style={{
                                        position: 'relative',
                                        zIndex: '1',
                                    }}
                                >
                                    <div className="errors" style={styles.error}>
                                        {this.props.errors.map((error, i) => (
                                            <p className="error" key={i}>
                                                {error}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            ) : null
                        ) : null
                    }
                />
                <div
                    style={{
                        position: 'absolute',

                        right: '0px',
                        top: '2px',
                    }}
                >
                    {this.props.children}
                </div>
            </div>
        );
    }
}

MyTextField.contextTypes = {
    color: PropTypes.string,
};

export default connectToForm(MyTextField);
export { MyTextField as TexfieldDisconnected };
