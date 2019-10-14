import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { Elements, StripeProvider, injectStripe } from 'react-stripe-elements';
import { Query, Mutation, useMutation } from 'react-apollo';
import { Title, BodySmall } from 'components/Text';
import { Input, InputRow, Label, useForm } from 'components/FormComponents';
import CurrencySelector from 'components/CurrencySelector';
import { SmartButton, Row, TeritaryButton } from 'components/Blocks';
import { Environment } from '../../constants/constants';
import { USER_BANK_ACCOUNT, UPDATE_USER_PAYOUT } from '../gql';
import IbanField from './IbanField';
import CountrySelector, { BankSelector } from './CountrySelector';
import { LoadingIndicator } from './LoadingPlaceholder';
import ErrorMessageApollo, { getErrorMessage } from './ErrorMessageApollo';
import { PhoneInputNew } from './PhoneInput';

const getStripeData = async ({ country, stripe, name, currency }) => {
    const tokenData = {
        currency,
        account_holder_name: name,
        account_holder_type: 'individual',
    };

    const { error, token } = await stripe.createToken(tokenData);

    if (error) {
        throw new Error(error.message);
    } else {
        console.log({ token });
        return { payoutInfo: token };
    }
};

const getXenditData = ({ country, name, bankCode, bankAccountNumber }) => {
    return {
        payoutInfo: {
            country,
            currency: 'IDR',
            bankAccountHolderName: name,
            bankAccountNumber: bankAccountNumber.trim(),
            bankCode,
        },
    };
};

const PayoutForm = ({ user, isUpdate, translate, stripe, onCancel, onSubmitted }) => {
    const [mutate, { loading: submitting, error }] = useMutation(UPDATE_USER_PAYOUT, {
        onCompleted: onSubmitted,
    });
    const [localError, setLocalError] = useState();
    const submit = async (values) => {
        setLocalError(null);
        try {
            const useXendit = values.country === 'ID';
            const data = useXendit
                ? getXenditData(values)
                : await getStripeData({ ...values, stripe });
            mutate({
                variables: {
                    ...data,
                    phone: values.phone,
                    id: user.id,
                    paymentProvider: useXendit ? 'XENDIT' : 'STRIPE',
                },
            });
        } catch (error) {
            const message = getErrorMessage(error);
            setLocalError(message);
        }
    };

    return (
        <div className="payout-form">
            <Title>{translate('Payout')}</Title>
            <BodySmall>{translate('payout.description')}</BodySmall>

            <Query query={USER_BANK_ACCOUNT} ssr={false}>
                {({ data, loading }) => {
                    if (loading) {
                        return (
                            <div style={{ height: 200, justifyContent: 'center' }}>
                                <LoadingIndicator label={'Loading bank information'} />
                            </div>
                        );
                    }

                    if (!data || !data.me) {
                        data = {
                            me: {
                                userMetadata: { bankAccount: {} },
                            },
                        };
                    }

                    const {
                        me: {
                            userMetadata: { bankAccount = {} },
                        },
                    } = data;

                    return (
                        <>
                            <MainForm
                                bankAccount={bankAccount}
                                translate={translate}
                                user={user}
                                loading={loading || submitting}
                                submit={submit}
                                isUpdate={isUpdate}
                                onCancel={onCancel}
                            />
                            <ErrorMessageApollo error={error || localError} />

                            <div className="row center">
                                <div className="col-xs-10">
                                    <p className="terms_link text-center">
                                        {translate('payout.terms')}
                                    </p>
                                </div>
                            </div>
                        </>
                    );
                }}
            </Query>
        </div>
    );
};

const MainForm = ({ user, bankAccount, translate, isUpdate, submit, onCancel, loading }) => {
    const { userMetadata } = user;
    const { phone, firstName, lastName } = userMetadata || {};
    const initialName = `${firstName} ${lastName}`;
    const bankAccountParsed = bankAccount || {};

    const [form, setForm] = useState({
        phone,
        name: bankAccountParsed.accountHolderName || initialName,
        country: bankAccountParsed.countryCode,
        bankCode: bankAccountParsed.bankCode,
        currency: bankAccountParsed.currency,
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const setValue = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

    const inIndonesia = form.country === 'ID';

    const handleSubmit = () => {
        const errors = runValidations();
        if (!errors.length) {
            submit(form);
        }
    };

    return (
        <>
            <InputRow style={{ marginTop: '24px' }}>
                <CountrySelector
                    noShadow
                    forceHeight
                    defaultValue={form.country}
                    label={translate('country')}
                    placeholder={translate('country')}
                    onChange={setValue('country')}
                    validation={(v) => (v ? null : 'Please select a country')}
                    registerValidation={registerValidation('country')}
                    unregisterValidation={unregisterValidation('country')}
                />

                <Input
                    half
                    label={translate('payout.account-name')}
                    defaultValue={form.name}
                    name="name"
                    type="text"
                    placeholder={translate('Full name')}
                    validation={(v) => {
                        if (!v) {
                            return 'Please enter name';
                        }
                        const [firstName, ...lastName] = v.split(' ');
                        if (!firstName || !lastName.some((s) => !!s.trim())) {
                            return 'Please enter both first and last name';
                        }
                    }}
                    onSave={setValue('name')}
                    registerValidation={registerValidation('name')}
                    unregisterValidation={unregisterValidation('name')}
                />

                <PhoneInputNew
                    half
                    label={translate('payout.account-phone')}
                    defaultValue={form.phone}
                    name="phone"
                    validation={(v) => (v ? null : 'Please enter phone number')}
                    placeholder={translate('Phone')}
                    onSave={setValue('phone')}
                />

                {inIndonesia ? (
                    <>
                        <BankSelector
                            noShadow
                            label={translate('Bank')}
                            defaultValue={form.bankCode}
                            placeholder={'Bank name'}
                            forceHeight={300}
                            onChange={setValue('bankCode')}
                            validation={(v) => (v ? null : 'Please select a bank')}
                            registerValidation={registerValidation('bankCode')}
                            unregisterValidation={unregisterValidation('bankCode')}
                        />
                        <Input
                            label={translate('payout.account-number')}
                            name="bankAccountNumber"
                            validate={['required']}
                            type="tel"
                            fullWidth={false}
                            placeholder={'000000000'}
                            onChange={setValue('bankAccountNumber')}
                            validation={(v) => (v ? null : 'Please enter account number')}
                            registerValidation={registerValidation('bankAccountNumber')}
                            unregisterValidation={unregisterValidation('bankAccountNumber')}
                        />
                    </>
                ) : (
                    <>
                        <CurrencySelector
                            noShadow
                            forceHeight={230}
                            key={form.country}
                            label={translate('currency')}
                            name="currency"
                            value={inIndonesia ? 'IDR' : null}
                            defaultValue={form.currency}
                            disabled={inIndonesia}
                            placeholder={inIndonesia ? undefined : translate('currency')}
                            validation={(v) => (v ? null : 'Please select currency')}
                            registerValidation={registerValidation('currency')}
                            unregisterValidation={unregisterValidation('currency')}
                        />
                        <IbanField
                            label={translate('payout.IBAN-number')}
                            onChange={setValue('bankName')}
                        />

                        {typeof form.bankName === 'string' && (
                            <Label style={{ marginTop: '-20px' }}>{form.bankName}</Label>
                        )}
                    </>
                )}
            </InputRow>
            <Row right>
                <TeritaryButton onClick={onCancel}>{translate('cancel')}</TeritaryButton>
                <SmartButton loading={loading} type="submit" onClick={handleSubmit}>
                    {isUpdate ? translate('update') : translate('save')}
                </SmartButton>
            </Row>
        </>
    );
};

const Injected = injectStripe(PayoutForm);

const StripeWrapper = (props) => {
    const [stripe, setStripe] = useState(null);

    useEffect(() => {
        if (window.Stripe) {
            setStripe(window.Stripe(Environment.STRIPE_PUBLIC_KEY));
        }
    }, []);

    return (
        <StripeProvider stripe={stripe}>
            <Elements>
                <Injected {...props} />
            </Elements>
        </StripeProvider>
    );
};

function mapStateToProps(state, ownprops) {
    return {
        ...ownprops,
        translate: getTranslate(state.locale),
        currentLanguage: getActiveLanguage(state.locale).code,
    };
}

export default connect(mapStateToProps)(StripeWrapper);

export const DisconnectedPayoutForm = StripeWrapper;
