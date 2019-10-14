import React, { useState } from 'react';
import { IbanElement } from 'react-stripe-elements';
import { Label } from '../../FormComponents';
import './index.css';

const IbanField = ({ onChange, label, children, onReady }) => {
    const [errors, setErrors] = useState([]);

    const onChangeHandler = (event) => {
        if (event.error) {
            setErrors([event.error.message]);
        } else {
            onChange(event.complete ? event.bankName || event : null);
        }
    };

    return (
        <Label>
            {label}
            <IbanElement
                supportedCountries={['SEPA']}
                placeholderCountry={'DK'}
                style={{
                    base: {
                        'color': '#32325d',
                        'fontFamily': '"AvenirNext-Regular", Helvetica, sans-serif',
                        'fontSmoothing': 'antialiased',
                        'fontSize': '14px',
                        '::placeholder': {
                            color: '#BBBBBB',
                        },
                    },
                    invalid: {
                        color: '#f44336',
                        iconColor: '#f44336',
                    },
                }}
                // onBlur={this.onBlur}
                // onFocus={(_) =>
                //     this.setState({
                //         focused: true,
                //     })
                // }
                classes={{
                    focus: 'focused',
                    empty: 'empty',
                    invalid: 'invalid',
                }}
                onChange={onChangeHandler}
                onReady={onReady}
            />
            {children}
        </Label>
    );
};

export default IbanField;
