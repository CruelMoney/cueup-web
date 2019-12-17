import React, { useState } from 'react';
import { IbanElement } from 'react-stripe-elements';
import './index.css';
import styled from 'styled-components';
import { inputStyle } from 'components/Blocks';
import { InputLabel } from '../../FormComponents';

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
        <InputLabel>
            {label}

            <Wrapper>
                <IbanElement
                    supportedCountries={['SEPA']}
                    placeholderCountry={'DK'}
                    style={{
                        base: {
                            'color': '#32325d',
                            'fontFamily': '"AvenirNext", Helvetica, sans-serif',
                            'fontSmoothing': 'antialiased',
                            'fontSize': '18px',
                            'lineHeight': '40px',
                            '::placeholder': {
                                color: '#98a4b3',
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
                />
            </Wrapper>
        </InputLabel>
    );
};

const Wrapper = styled.div`
    ${inputStyle}
    padding-left: 9px;
`;
export default IbanField;
