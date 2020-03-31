/* eslint-disable camelcase */
import React, { useState, useReducer, useEffect, useCallback } from 'react';
import Card from 'react-credit-card-input';
import useScript from '@charlietango/use-script';
import Iframe from 'react-iframe';
import { withApollo, useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Input, LabelHalf, InputRow } from 'components/FormComponents';
import { SmartButton, inputStyle, RowMobileCol, TeritaryButton } from 'components/Blocks';
import { useForm, validators } from 'components/hooks/useForm';
import { useServerContext } from 'components/hooks/useServerContext';
import { PAY_EVENT } from '../gql';
import Popup from './Popup';
import CountrySelector from './CountrySelector';
import ErrorMessageApollo, { getErrorMessage } from './ErrorMessageApollo';

const XenditForm = ({ translate, paymentIntent, onPaymentConfirmed, client, goBack }) => {
    const [reviewPopup, setReviewPopup] = useState();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState();
    const { form, runValidations, getInputProps } = useForm();

    const [mutate] = useMutation(PAY_EVENT);

    const startPayment = () => {
        const { card_email, card_name, card_country, card } = form;
        let { expiry, cvc, number } = card;
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
                setError(error.message);
            }
            handleVerification({ ...result, cardData });
        });
    };

    const handleVerification = (data) => {
        // SHOW 3d secure popup
        const { payer_authentication_url, status } = data;
        if (status === 'IN_REVIEW') {
            setReviewPopup(payer_authentication_url);
            return;
        } else if (status === 'VERIFIED') {
            // submit token to payment on server
            handlePayment(data);
        } else {
            setError('Something went wrong');
            setLoading(false);
        }
    };

    const confirmPayment = async (e) => {
        e.preventDefault();

        const errors = runValidations();
        if (errors?.length) {
            return;
        }

        try {
            setError(null);
            setLoading(true);
            startPayment();
        } catch (error) {
            console.log({ error });
            setError(error.message);
        }
    };

    const handlePayment = async ({ authentication_id, id, cardData }) => {
        try {
            await mutate({
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
            });
            onPaymentConfirmed();
        } catch (error) {
            setError(getErrorMessage(error));
        } finally {
            setLoading(false);
        }
    };

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
            <form name="pay-form" onSubmit={confirmPayment}>
                <PaymentRow small>
                    <CountrySelector
                        noShadow
                        forceHeight={250}
                        {...getInputProps('card_country')}
                        validation={(v) => (!v ? 'Please select a country from the list' : null)}
                        placeholder={translate('country')}
                    />
                    <Input
                        half
                        {...getInputProps('card_email')}
                        type="email"
                        validation={[validators.required, validators.email]}
                        placeholder={translate('Billing email')}
                    />

                    <Input
                        half
                        {...getInputProps('card_name')}
                        type="text"
                        validation={[validators.required, validators.lastName]}
                        placeholder={translate('Cardholder name')}
                    />

                    <ConnectedCard {...getInputProps('card')} validation={[validators.required]} />
                </PaymentRow>
                <div style={{ marginTop: '16x' }}>
                    <RowMobileCol right reverse>
                        {goBack && (
                            <TeritaryButton onClick={goBack} type="button">
                                Back
                            </TeritaryButton>
                        )}
                        <SmartButton type="submit" loading={loading}>
                            {translate('Confirm & Pay')}
                        </SmartButton>
                    </RowMobileCol>
                    <ErrorMessageApollo error={error} />
                </div>
            </form>
        </>
    );
};

const PaymentRow = styled(InputRow)`
    > * {
        margin-bottom: 12px;
    }
`;

const ConnectedCard = ({ onSave }) => {
    const [loaded] = useScript('https://js.xendit.co/v1/xendit.min.js');
    const { environment } = useServerContext();

    if (loaded) {
        window.Xendit.setPublishableKey(environment.XENDIT_PUB_KEY);
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

    const [error, setError] = useState(null);
    const [isFocus, setFocus] = useState(null);
    const [card, dispatch] = useReducer(cardReducer, {});

    const changeHandler = useCallback(onSave, []);

    useEffect(() => {
        const { cvc, expiry, number } = card;
        if (cvc && expiry && number) {
            changeHandler(card);
        } else {
            changeHandler(null);
        }
    }, [card, changeHandler]);

    return (
        <LabelHalf>
            <Wrapper error={error}>
                <Card
                    containerClassName={'card-container '}
                    inputStyle={{
                        'color': '#32325d',
                        'fontFamily': '"AvenirNext", Helvetica, sans-serif',
                        'fontSmoothing': 'antialiased',
                        'fontSize': '18px',
                        'background': 'transparent',
                        '::placeholder': {
                            color: '#98a4b3',
                        },
                    }}
                    fieldStyle={{
                        flex: 1,
                        border: 'none !important',
                        padding: 0,
                        background: 'transparent',
                    }}
                    dangerTextStyle={{ display: 'none' }}
                    cardCVCInputProps={{
                        onFocus: (e) => setFocus(true),
                        onBlur: (e) => setFocus(false),
                        onChange: (e) => {
                            setError(false);
                            dispatch({ key: 'cvc', value: e.target.value });
                        },
                        onError: (e) => {
                            dispatch(null);
                            setError(e);
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
                            setError(e);
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
                            console.log({ e });
                            setError(e);
                        },
                    }}
                />
            </Wrapper>
            <p className="error">{error}</p>
        </LabelHalf>
    );
};

const Wrapper = styled.div`
    ${inputStyle}
    padding-left: 9px;
    .card-container {
        height: 40px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
export default withApollo(XenditForm);
