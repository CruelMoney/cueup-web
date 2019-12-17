import React, { useState, useEffect } from 'react';
import { Elements, StripeProvider, injectStripe } from 'react-stripe-elements';
import { Query, Mutation, useMutation, useQuery } from 'react-apollo';
import { Title, BodySmall } from 'components/Text';
import { Input, InputRow, Label } from 'components/FormComponents';
import CurrencySelector from 'components/CurrencySelector';
import { SmartButton, Row, TeritaryButton, LoadingIndicator } from 'components/Blocks';
import { useForm } from 'components/hooks/useForm';
import { Environment, AllCurrencies } from '../../../constants/constants';
import IbanField from '../IbanField';
import CountrySelector, { BankSelector } from '../CountrySelector';
import ErrorMessageApollo, { getErrorMessage } from '../ErrorMessageApollo';
import PhoneInput from '../PhoneInput';
import { UPDATE_USER_PAYOUT, USER_PAYOUT_DATA, USER_PAYOUT_METHOD } from './gql';

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

const PayoutForm = ({
    user,
    loading,
    bankAccount,
    isUpdate,
    translate,
    stripe,
    onCancel,
    onSubmitted,
    availableBankCountries,
}) => {
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
                    paymentProvider: useXendit ? 'XENDIT' : 'STRIPE',
                },
            });
        } catch (error) {
            const message = getErrorMessage(error);
            setLocalError(message);
        }
    };

    if (loading) {
        return (
            <div style={{ height: 200, justifyContent: 'center' }}>
                <LoadingIndicator label={'Loading bank information'} />
            </div>
        );
    }

    return (
        <>
            <MainForm
                availableBankCountries={availableBankCountries}
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
                    <p className="terms_link text-center">{translate('payout.terms')}</p>
                </div>
            </div>
        </>
    );
};

const MainForm = ({
    user,
    bankAccount,
    availableBankCountries,
    translate,
    isUpdate,
    submit,
    onCancel,
    loading,
}) => {
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

    const onCountryChange = (c) => {
        const selectedCountry = availableBankCountries.find((c2) => c2.countryCode === c);
        setValue('country')(c);
        setValue('currency')(selectedCountry?.defaultCurrency);
        setValue('bankName')(null);
        setValue('routingNumber1')(null);
        setValue('routingNumber2')(null);
    };

    const availableCountryCodes = availableBankCountries.map((c) => c.countryCode);
    const bankCountry = availableBankCountries.find((c) => c.countryCode === form.country);

    return (
        <>
            <InputRow style={{ marginTop: '24px' }}>
                <CountrySelector
                    noShadow
                    forceHeight
                    defaultValue={form.country}
                    filter={(c) => availableCountryCodes.includes(c.value)}
                    label={translate('country')}
                    placeholder={translate('country')}
                    onSave={onCountryChange}
                    validation={(v) => (v ? null : 'Please select a country from the list')}
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

                <PhoneInput
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
                            filter={(c) => bankCountry.supportedCurrencies.includes(c)}
                            defaultValue={form.currency}
                            disabled={inIndonesia}
                            suggestions={AllCurrencies}
                            onSave={setValue('currency')}
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

const DataWrapper = (props) => {
    const { translate } = props;

    const { loading, data } = useQuery(USER_PAYOUT_METHOD, {
        variables: { id: props.id },
        ssr: false,
        skip: !props.id,
    });

    const bankAccount = data?.payoutMethod;

    return (
        <div className="payout-form">
            <Title>{translate('Bank Account')}</Title>
            <BodySmall>{translate('payout.description')}</BodySmall>

            <StripeWrapper
                {...props}
                loading={loading}
                bankAccount={bankAccount}
                availableBankCountries={data?.availableBankCountries}
            />
        </div>
    );
};

export default DataWrapper;
