import React, { useState, useEffect } from 'react';
import { Elements, StripeProvider, injectStripe } from 'react-stripe-elements';
import { useMutation, useQuery } from 'react-apollo';
import { Title, BodySmall } from 'components/Text';
import { Input, InputRow, Label } from 'components/FormComponents';
import CurrencySelector from 'components/CurrencySelector';
import { SmartButton, Row, TeritaryButton, LoadingIndicator } from 'components/Blocks';
import { useForm } from 'components/hooks/useForm';
import { ME } from 'components/gql';
import { useServerContext } from 'components/hooks/useServerContext';
import useTranslate from 'components/hooks/useTranslate';
import { AllCurrencies, PAYMENT_PROVIDERS, PAYOUT_TYPES } from '../../../constants/constants';
import CountrySelector, { BankSelector } from '../CountrySelector';
import ErrorMessageApollo, { getErrorMessage } from '../ErrorMessageApollo';
import PhoneInput from '../PhoneInput';
import {
    UPDATE_USER_PAYOUT,
    USER_PAYOUT_METHOD,
    REMOVE_PAYOUT_METHOD,
    USER_PAYOUT_DATA,
} from './gql';

const getStripeData = async ({
    stripe,
    country,
    currency,
    name,
    accountNumber,
    routingNumber1,
    routingNumber2,
    phone,
}) => {
    const account = {
        type: 'bank_acount',
        bank_account: {
            country,
            currency,
            account_holder_name: name,
            account_holder_type: 'individual',
            account_number: accountNumber.trim(),
        },
    };
    if (routingNumber1) {
        account.bank_account.routing_number = [routingNumber1, routingNumber2]
            .filter(Boolean)
            .map((r) => r.trim())
            .join('');
    }

    const { error, token } = await stripe.createToken('bank_account', account);

    if (error) {
        throw new Error(error.message);
    } else {
        return {
            data: { ...token, phone },
            phone,
            provider: PAYMENT_PROVIDERS.STRIPE,
            type: PAYOUT_TYPES.BANK,
        };
    }
};

const getXenditData = ({ phone, country, name, bankCode, accountNumber }) => {
    return {
        provider: PAYMENT_PROVIDERS.XENDIT,
        type: PAYOUT_TYPES.BANK,
        data: {
            phone,
            country,
            currency: 'IDR',
            bankAccountHolderName: name,
            bankAccountNumber: accountNumber.trim(),
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
        refetchQueries: [{ query: ME }],
        awaitRefetchQueries: true,
    });
    const [localError, setLocalError] = useState();
    const submit = async (values) => {
        setLocalError(null);
        try {
            const useXendit = values.country === 'ID';
            const variables = useXendit
                ? getXenditData(values)
                : await getStripeData({ ...values, stripe });
            mutate({
                variables,
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
                    <p
                        className="terms_link text-center"
                        dangerouslySetInnerHTML={{ __html: translate('payout.terms') }}
                    />
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

    const [remove, { loading: removing }] = useMutation(REMOVE_PAYOUT_METHOD, {
        variables: { id: bankAccount?.id },
        onCompleted: onCancel,
        refetchQueries: [{ query: ME }],
        awaitRefetchQueries: true,
    });

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
                ) : (
                    <>
                        <CurrencySelector
                            noShadow
                            forceHeight={230}
                            key={form.country}
                            label={translate('currency')}
                            name="currency"
                            filter={(c) =>
                                bankCountry && bankCountry.supportedCurrencies.includes(c)
                            }
                            defaultValue={form.currency}
                            disabled={inIndonesia}
                            suggestions={AllCurrencies}
                            onSave={setValue('currency')}
                            placeholder={inIndonesia ? undefined : translate('currency')}
                            validation={(v) => (v ? null : 'Please select currency')}
                            registerValidation={registerValidation('currency')}
                            unregisterValidation={unregisterValidation('currency')}
                        />

                        {bankCountry?.labels.label2 && (
                            <Input
                                disabled={!form.country}
                                label={bankCountry?.labels.label2}
                                placeholder={bankCountry?.labels.placeholder2}
                                onSave={setValue('routingNumber1')}
                                validation={(v) =>
                                    v ? null : 'Please enter ' + bankCountry?.labels.label2
                                }
                                registerValidation={registerValidation('routingNumber1')}
                                unregisterValidation={unregisterValidation('routingNumber1')}
                            />
                        )}
                        {bankCountry?.labels.label3 && (
                            <Input
                                disabled={!form.country}
                                label={bankCountry?.labels.label3}
                                placeholder={bankCountry?.labels.placeholder3}
                                onSave={setValue('routingNumber2')}
                                validation={(v) =>
                                    v ? null : 'Please enter ' + bankCountry?.labels.label3
                                }
                                registerValidation={registerValidation('routingNumber2')}
                                unregisterValidation={unregisterValidation('routingNumber2')}
                            />
                        )}

                        {typeof form.bankName === 'string' && (
                            <Label style={{ marginTop: '-20px' }}>{form.bankName}</Label>
                        )}
                    </>
                )}
                <Input
                    disabled={!form.country}
                    defaultValue={form.last4 ? '∙∙∙∙∙∙∙∙∙∙∙∙' + form.last4 : null}
                    label={bankCountry?.labels.label1 ?? 'IBAN or Account Number'}
                    placeholder={bankCountry?.labels.placeholder1 ?? 'EU5000400440116243'}
                    onSave={setValue('accountNumber')}
                    validation={(v) => (v ? null : 'Please enter ' + bankCountry?.labels.label1)}
                    registerValidation={registerValidation('accountNumber')}
                    unregisterValidation={unregisterValidation('accountNumber')}
                />
            </InputRow>
            <Row right>
                <TeritaryButton onClick={onCancel}>{translate('back')}</TeritaryButton>
                {isUpdate && (
                    <SmartButton
                        level="secondary"
                        warning="Are you sure you want to remove the payout method?"
                        loading={removing}
                        onClick={remove}
                    >
                        {translate('Remove')}
                    </SmartButton>
                )}
                <SmartButton loading={loading} type="submit" onClick={handleSubmit}>
                    {isUpdate ? translate('Update') : translate('Save')}
                </SmartButton>
            </Row>
        </>
    );
};

const Injected = injectStripe(PayoutForm);

const StripeWrapper = (props) => {
    const [stripe, setStripe] = useState(null);
    const { environment } = useServerContext();

    useEffect(() => {
        if (window.Stripe) {
            setStripe(window.Stripe(environment.STRIPE_PUBLIC_KEY));
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
    const { translate } = useTranslate();

    const { loading, data } = useQuery(USER_PAYOUT_METHOD, {
        variables: { id: props.id },
        ssr: false,
        skip: !props.id,
    });

    const { loading: loadingUserData, data: userData } = useQuery(USER_PAYOUT_DATA, {
        ssr: false,
    });

    const bankAccount = data?.payoutMethod;

    return (
        <div className="payout-form">
            <Title>{translate('Bank Account')}</Title>
            <BodySmall>{translate('payout.description')}</BodySmall>

            <StripeWrapper
                {...props}
                loading={loading || loadingUserData}
                translate={translate}
                bankAccount={bankAccount}
                isUpdate={props.id}
                availableBankCountries={
                    data?.availableBankCountries ?? userData?.availableBankCountries
                }
            />
        </div>
    );
};

export default DataWrapper;
