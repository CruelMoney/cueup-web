import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { getTranslate, getActiveLanguage } from 'react-localize-redux';
import { Elements, StripeProvider, injectStripe } from 'react-stripe-elements';
import { Query, Mutation } from 'react-apollo';
import { Title, BodySmall } from 'components/Text';
import { Input, InputRow } from 'components/FormComponents';
import CurrencySelector from 'components/CurrencySelector';
import { SmartButton } from 'components/Blocks';
import { Environment } from '../../constants/constants';
import { USER_BANK_ACCOUNT, UPDATE_USER_PAYOUT } from '../gql';
import IbanField from './IbanField';
import CountrySelector, { BankSelector } from './CountrySelector';
import { LoadingIndicator } from './LoadingPlaceholder';
import { getErrorMessage } from './ErrorMessageApollo';
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

const PayoutForm = ({ user, isUpdate, translate, stripe }) => {
    const [valid, setValidity] = useState(false);
    const submit = (mutate) => async ({ values }, cb) => {
        try {
            const useXendit = values.country === 'ID';
            const data = useXendit
                ? getXenditData(values)
                : await getStripeData({ ...values, stripe });
            await mutate({
                variables: {
                    ...data,
                    phone: values.phone,
                    id: user.id,
                    paymentProvider: useXendit ? 'XENDIT' : 'STRIPE',
                },
            });
            cb();
        } catch (error) {
            const message = getErrorMessage(error);
            cb(message || 'Something went wrong');
        }
    };

    return (
        <div className="payout-form">
            <Mutation mutation={UPDATE_USER_PAYOUT}>
                {(mutate) => (
                    <form>
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
                                        />
                                        <div className="row  center">
                                            <div className="col-xs-6">
                                                <SmartButton
                                                    loading={loading}
                                                    type="submit"
                                                    disabled={!valid}
                                                    onClick={submit(mutate)}
                                                >
                                                    {isUpdate
                                                        ? translate('update')
                                                        : translate('save')}
                                                </SmartButton>
                                            </div>
                                        </div>

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
                    </form>
                )}
            </Mutation>
        </div>
    );
};

const MainForm = ({ user, bankAccount, translate }) => {
    const { userMetadata } = user;
    const { phone, firstName, lastName } = userMetadata || {};
    const initialName = `${firstName} ${lastName}`;
    const bankAccountParsed = bankAccount || {};
    const [country, setCountry] = useState(bankAccountParsed.countryCode);
    const [bankName, setBankName] = useState(null);

    const inIndonesia = country === 'ID';
    return (
        <InputRow style={{ marginTop: '24px' }}>
            <CountrySelector
                noShadow
                defaultValue={bankAccountParsed.countryCode}
                label={translate('country')}
                name="country"
                validate={['required']}
                placeholder={translate('country')}
                onChange={setCountry}
                forceHeight
            />

            <CurrencySelector
                noShadow
                key={country}
                label={translate('currency')}
                name="currency"
                validate={['required']}
                value={inIndonesia ? 'IDR' : bankAccountParsed.currency}
                disabled={inIndonesia}
                placeholder={inIndonesia ? undefined : translate('currency')}
                forceHeight
            />

            <Input
                half
                label={translate('payout.account-name')}
                value={bankAccountParsed.accountHolderName || initialName}
                name="name"
                type="text"
                validate={['required', 'lastName']}
                placeholder={translate('Full name')}
            />

            <PhoneInputNew
                half
                label={translate('payout.account-phone')}
                value={phone}
                name="phone"
                validate={['required']}
                placeholder={translate('Phone')}
            />

            {inIndonesia ? (
                <>
                    <BankSelector
                        noShadow
                        label={translate('Bank')}
                        value={bankAccountParsed.bankCode}
                        placeholder={'Bank name'}
                        forceHeight={200}
                    />
                    <Input
                        label={translate('payout.account-number')}
                        name="bankAccountNumber"
                        validate={['required']}
                        type="tel"
                        fullWidth={false}
                        placeholder={'000000000'}
                    />
                </>
            ) : (
                <>
                    <IbanField
                        label={translate('payout.IBAN-number')}
                        onChange={setBankName}
                        name="iban"
                        validate={['required']}
                    />

                    {typeof bankName === 'string' && (
                        <Input disabled label={translate('Bank')} value={bankName} />
                    )}
                </>
            )}
        </InputRow>
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
