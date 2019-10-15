/* eslint-disable camelcase */
import React, { PureComponent, useState, useReducer, useEffect, useCallback } from 'react';
import { getTranslate } from 'react-localize-redux';
import { connect } from 'react-redux';
import Card from 'react-credit-card-input';
import useScript from '@charlietango/use-script';
import Iframe from 'react-iframe';
import { withApollo } from 'react-apollo';
import { Input } from 'components/FormComponents';
import { SmartButton } from 'components/Blocks';
import { PAY_EVENT } from '../gql';
import Popup from './Popup';
import CountrySelector from './CountrySelector';
import { getErrorMessage } from './ErrorMessageApollo';

class XenditForm extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            valid: false,
            reviewPopup: false,
        };
    }

    getCardToken = (values, cb) => {
        const { card_email, card_name, card_country, card } = values;
        let { expiry, cvc, number } = card;
        const { paymentIntent } = this.props;
        expiry = expiry.split('/').map((s) => s.trim());

        const cardData = {
            amount: Math.ceil(paymentIntent.offer.totalPayment.amount / 100),
            card_number: number.replace(/\s/g, ''),
            card_exp_month: expiry[0],
            card_exp_year: 20 + expiry[1],
            card_cvn: cvc,
            is_multiple_use: false,
            gigId: paymentIntent.gigId,
            card_email,
            card_name,
            card_country,
            meta_enabled: true,
        };
        window.Xendit.card.createToken(cardData, (error, result) => {
            if (error && error.error_code) {
                return cb(error.message);
            }
            this.onCardTokenized({ ...result, cardData }, cb);
        });
    };

    onCardTokenized = (data, cb) => {
        // SHOW 3d secure popup
        const { payer_authentication_url, status } = data;
        if (status === 'IN_REVIEW') {
            this.setState({
                reviewPopup: payer_authentication_url,
            });
            return;
        } else if (status === 'VERIFIED') {
            // submit token to payment on server
            this.handlePayment(data, cb);
        } else {
            cb('Something went wrong');
        }
    };

    confirmPayment = (form, cb) => {
        try {
            this.getCardToken(form.values, cb);
        } catch (error) {
            console.log({ error });
            cb(error.message);
        }
    };

    handlePayment = async ({ authentication_id, id, cardData }, cb) => {
        const { paymentIntent, onPaymentConfirmed, client } = this.props;

        try {
            await client.mutate({
                variables: {
                    gigId: paymentIntent.gigId,
                    paymentProvider: 'XENDIT',
                    paymentData: {
                        token_id: id,
                        authentication_id,
                        card_cvn: cardData.card_cvn,
                        totalAmount: cardData.amount,
                        token: paymentIntent.token.token,
                    },
                },
                mutation: PAY_EVENT,
            });
            cb();
            onPaymentConfirmed();
        } catch (error) {
            throw cb(getErrorMessage(error));
        }
    };

    render() {
        const { reviewPopup } = this.state;
        const { translate } = this.props;
        return (
            <>
                {reviewPopup && (
                    <Popup showing={!!reviewPopup} onClickOutside={(_) => {}}>
                        <Iframe
                            url={reviewPopup}
                            width="450px"
                            height="450px"
                            id="myId"
                            className="3dsecure-popup"
                            display="initial"
                            position="relative"
                        />
                    </Popup>
                )}
                <form
                    formValidCallback={() => this.setState({ valid: true })}
                    formInvalidCallback={() => this.setState({ valid: false })}
                    name="pay-form"
                >
                    <Input
                        name="card_email"
                        type="email"
                        validate={['required', 'email']}
                        placeholder={translate('Billing email')}
                    />
                    <div className="row">
                        <div className="col-xs-6">
                            <Input
                                name="card_name"
                                type="text"
                                validate={['required', 'lastName']}
                                placeholder={translate('Cardholder name')}
                            />
                        </div>
                        <div className="col-xs-6">
                            <CountrySelector
                                name="card_country"
                                validate={['required']}
                                placeholder={translate('country')}
                            />
                        </div>
                    </div>
                    <ConnectedCard name="card" validate={['required']} />
                    <div style={{ marginTop: '24px' }}>
                        <SmartButton
                            glow
                            loading={this.state.loading}
                            disabled={!this.state.valid}
                            rounded={true}
                            name={'confirm_payment'}
                            onClick={this.confirmPayment}
                        >
                            {translate('Confirm & pay')}
                        </SmartButton>
                    </div>
                </form>
            </>
        );
    }
}

const ConnectedCard = ({ refForward, onChange }) => {
    const [loaded] = useScript('https://js.xendit.co/v1/xendit.min.js');

    if (loaded) {
        window.Xendit.setPublishableKey(process.env.REACT_APP_XENDIT_PUB_KEY);
    }

    const cardReducer = (state, action) => {
        if (!action) {
            return state;
        }
        const { value, key } = action;
        return {
            ...state,
            [key]: value,
        };
    };

    const [hasError, setError] = useState(null);
    const [isFocus, setFocus] = useState(null);
    const [card, dispatch] = useReducer(cardReducer, {});

    const changeHandler = useCallback(onChange, []);

    useEffect(() => {
        const { cvc, expiry, number } = card;
        if (cvc && expiry && number) {
            changeHandler(card);
        } else {
            changeHandler(null);
        }
    }, [card, changeHandler]);

    const className = `${hasError ? 'StripeElement--invalid' : ''} ${
        isFocus ? 'StripeElement--focus' : ''
    }`;

    return (
        <div className="stripe-card">
            <Card
                containerClassName={'StripeElement ' + className}
                inputStyle={{
                    'color': '#32325d',
                    'fontFamily': '"AvenirNext-Regular", Helvetica, sans-serif',
                    'fontSmoothing': 'antialiased',
                    'fontSize': '14px',
                    '::placeholder': {
                        color: '#BBBBBB',
                    },
                }}
                fieldStyle={{
                    flex: 1,
                    border: 'none !important',
                    padding: 0,
                }}
                dangerTextClassName="error"
                dangerTextStyle={{ top: '2.2em !important' }}
                cardCVCInputProps={{
                    onFocus: (e) => setFocus(true),
                    onBlur: (e) => setFocus(false),
                    onChange: (e) => {
                        setError(false);
                        dispatch({ key: 'cvc', value: e.target.value });
                    },
                    onError: (e) => {
                        dispatch(null);
                        setError(true);
                    },
                }}
                cardExpiryInputProps={{
                    onFocus: (e) => setFocus(true),
                    onBlur: (e) => setFocus(false),
                    onChange: (e) => {
                        setError(false);
                        dispatch({ key: 'expiry', value: e.target.value });
                    },
                    onError: (e) => {
                        dispatch(null);
                        setError(true);
                    },
                }}
                cardNumberInputProps={{
                    onFocus: (e) => setFocus(true),
                    onBlur: (e) => {
                        setFocus(false);
                    },
                    onChange: (e) => {
                        setError(false);
                        dispatch({ key: 'number', value: e.target.value });
                    },
                    onError: (e) => {
                        dispatch(null);
                        setError(true);
                    },
                }}
            />
        </div>
    );
};

function mapStateToProps(state, ownprops) {
    return {
        ...ownprops,
        translate: getTranslate(state.locale),
    };
}

export default connect(mapStateToProps)(withApollo(XenditForm));
