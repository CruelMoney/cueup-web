import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { Mutation } from 'react-apollo';
import { SmartButton, Container } from 'components/Blocks';
import { Input } from 'components/FormComponents';
import RegistrationElement from 'components/common/RegistrationElement';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import Footer from '../../components/common/Footer';

import NumberedList from '../../components/common/NumberedList';
import ErrorMessageApollo from '../../components/common/ErrorMessageApollo';
import { RESET_PASSWORD } from '../../components/gql';
import { validators, useForm } from '../../components/hooks/useForm';

const ResetPassword = () => {
    const { translate } = useTranslate();
    useEffect(() => {
        document.body.classList.add('not-found');

        return () => {
            document.body.classList.remove('not-found');
        };
    }, []);

    const [msg, setMsg] = useState();
    const [error, setError] = useState();
    const { runValidations, form, getInputProps } = useForm();

    const request = (mutate) => (e) => {
        e.preventDefault();
        try {
            const errors = runValidations(true);
            if (errors?.length) {
                return;
            }

            const { password } = form;

            const parsedUrl = new URL(window.location.href);
            const token = parsedUrl.searchParams.get('token');
            const passwordReset = parsedUrl.searchParams.get('passwordReset');

            if (!token || !passwordReset) {
                throw new Error('Token missing');
            }

            mutate({
                variables: { password, token },
            });
            return false;
        } catch (error) {
            console.log({ error });
            setError(error);
        }
    };

    const siteTitle = translate('reset-password-title');
    const siteDescription = translate('reset-password-description');

    return (
        <div className="reset-password-screen">
            <Helmet>
                <body className="white-theme" />
                <title>{siteTitle + ' | Cueup'}</title>
                <meta name="description" content={siteDescription} />

                <meta property="og:title" content={siteTitle + ' | Cueup'} />
                <meta property="og:description" content={siteDescription} />

                <meta name="twitter:title" content={siteTitle + ' | Cueup'} />
                <meta name="twitter:description" content={siteDescription} />
            </Helmet>
            <Container>
                <div
                    className="signup fix-top-mobile"
                    style={{ maxWidth: 900, margin: '60px auto' }}
                >
                    <h1 style={{ marginBottom: '32px' }}>{siteTitle}</h1>
                    <Mutation
                        mutation={RESET_PASSWORD}
                        onCompleted={() => setMsg('Your password has been reset')}
                    >
                        {(mutate, { loading, error: apolloError }) => {
                            return (
                                <form name={'reset-password-form'} onSubmit={request(mutate)}>
                                    <NumberedList>
                                        <RegistrationElement label="New password" active={true}>
                                            <Input
                                                {...getInputProps('password')}
                                                big
                                                type="password"
                                                name="password"
                                                validation={[
                                                    validators.required,
                                                    validators.minLength(6),
                                                ]}
                                                placeholder="Min. 6 characters"
                                            />
                                        </RegistrationElement>
                                        <RegistrationElement label="Repeat password" active={true}>
                                            <Input
                                                {...getInputProps('repeatPassword')}
                                                big
                                                type="password"
                                                name="repeatPassword"
                                                validation={[
                                                    validators.required,
                                                    validators.matches(form.password),
                                                ]}
                                                placeholder="Something super secret"
                                            />
                                        </RegistrationElement>
                                    </NumberedList>

                                    {msg ? (
                                        <p
                                            style={{
                                                fontSize: '20px',
                                                textAlign: 'center',
                                            }}
                                        >
                                            {msg}
                                        </p>
                                    ) : (
                                        <SmartButton
                                            glow
                                            type="submit"
                                            loading={loading}
                                            name="reset-password"
                                            onClick={request(mutate)}
                                        >
                                            <div style={{ minWidth: '100px' }}>
                                                {translate('Reset')}
                                            </div>
                                        </SmartButton>
                                    )}
                                    <ErrorMessageApollo error={error || apolloError} />
                                </form>
                            );
                        }}
                    </Mutation>
                </div>
            </Container>
            <Footer
                color={'#31DAFF'}
                noSkew={true}
                firstTo={translate(appRoutes.home)}
                secondTo={translate(appRoutes.signUp)}
                firstLabel={translate('arrange-event')}
                secondLabel={translate('apply-to-become-dj')}
                title={translate('ready-to-get-started')}
                subTitle={translate('arrange-event-or-become-dj')}
            />
        </div>
    );
};

export default ResetPassword;
