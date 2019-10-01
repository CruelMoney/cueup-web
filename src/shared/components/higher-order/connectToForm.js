import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as validators from '../../utils/validators';

function connectToForm(WrappedComponent) {
    class FormConnection extends Component {
        static contextTypes = {
            registerValidation: PropTypes.func,
            updateValue: PropTypes.func,
            registerReset: PropTypes.func,
            registerBeforeSubmit: PropTypes.func,
        };

        constructor(props, context) {
            super(props, context);
            const { value } = props;
            //errors needs to exist
            this.state = {
                errors: [],
                value,
            };
        }

        setErrors = (errors) => {
            this.setState((state) => ({
                errors,
            }));
        };

        isValid = (showErrors, value = this.state.value) => {
            let errors = this.state.errors;

            if (this.props.validate) {
                const newErrors = this.props.validate.reduce((memo, validator) => {
                    if (typeof validator === 'function') {
                        return memo.concat(validator(value));
                    }
                    return memo.concat(validators[validator](value));
                }, this.props.errors || []);

                errors = newErrors;

                if (showErrors) {
                    this.setState({
                        errors,
                    });
                }
            }

            const valid = !errors.length;

            return valid;
        };

        beforeSubmit = (_) => {
            if (this.props.updateBeforeSubmit) {
                return this.updateValue(this.state.value);
            }
        };

        componentDidMount() {
            const { dontUpdateOnMount, value } = this.props;

            if (typeof value !== 'undefined' && value !== null && !dontUpdateOnMount) {
                this.onChange(value);
            }
            if (this.context.registerValidation) {
                this.removeValidationFromContext = this.context.registerValidation((show) =>
                    this.isValid(show)
                );
            }
            if (this.context.registerReset) {
                this.removeReset = this.context.registerReset(() =>
                    this.setState({ value: this.props.value })
                );
            }
            if (this.context.registerBeforeSubmit) {
                this.context.registerBeforeSubmit(this.beforeSubmit);
            }
        }

        componentWillUnmount() {
            if (this.removeValidationFromContext) {
                this.removeValidationFromContext();
            }
            if (this.removeReset) {
                this.removeReset();
            }
        }

        UNSAFE_componentWillReceiveProps(nextprops) {
            if (nextprops.errors) {
                setTimeout(() => {
                    this.isValid(true);
                }, 100);
            }
        }

        timer = null;

        onChange = (value) => {
            if (this.props.onUpdatePipeFunc) {
                value = this.props.onUpdatePipeFunc(this.state.value, value);
            }

            this.setState({
                value: value,
            });
            clearTimeout(this.timer);
            this.timer = setTimeout(() => {
                this.isValid(true, value);
                this.updateValue(value);
            }, 500);
            if (this.props.onChange) {
                this.props.onChange(value);
            }
        };

        updateValue = (value) => {
            if (this.context.updateValue) {
                return this.context.updateValue(this.props.name, value);
            }
        };

        onBlur = () => {
            setTimeout(() => {
                this.isValid(true);
            }, 100);
        };

        render() {
            return (
                <WrappedComponent
                    {...this.props}
                    {...this.state}
                    onChange={this.onChange}
                    onBlur={this.onBlur}
                    setErrors={this.setErrors}
                />
            );
        }
    }
    return FormConnection;
}

export default connectToForm;
