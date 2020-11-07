import React, { useState, useEffect, useCallback } from 'react';
import emailValidator from 'email-validator';

import { Mutation } from '@apollo/client/react/components';
import styled from 'styled-components';
import { SmartButton, RowWrap, Hr, Col, Row } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import useOnLoggedIn from 'components/hooks/useOnLoggedIn';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';
import { useServerContext } from 'components/hooks/useServerContext';
import useSocialLogin from 'components/hooks/useSocialLogin';
import { LOGIN, REQUEST_PASSWORD_RESET } from '../../gql';
import { Input } from '../../FormComponents';
import ErrorMessageApollo, { getErrorMessage } from '../ErrorMessageApollo';
import fbLogo from '../../../assets/icons/fb.svg';
import googleLogo from '../../../assets/icons/google.svg';

const LoginStyle = styled.div`
    button {
        margin-bottom: 12px;
        > span {
            width: 100%;
        }
        > span:nth-child(2) {
            width: auto;
            position: absolute;
            right: 1em;
        }
        img {
            position: absolute;
            left: 0px;
            height: 20px;
            width: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
`;

const Login = ({ redirect = true, error, onLogin }) => {
    const { environment } = useServerContext();

    const { translate } = useTranslate();
    const [state, setState] = useState({
        email: '',
        password: '',
        isValid: false,
        error,
        message: '',
        loading: false,
    });

    const callback = async () => {
        onLogin && (await onLogin());
        setStateValue({ loading: false, error: null });
    };

    const onLoggedIn = useOnLoggedIn({ onLoggedIn: callback, redirect });

    const setStateValue = useCallback((data) => setState((s) => ({ ...s, ...data })), [setState]);

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const error = parsedUrl.searchParams.get('error');
        if (error) {
            setStateValue({ error });
        }
    }, [setStateValue]);

    const onRequestChangePassword = (mutate) => async (_form, _callback) => {
        const { email } = state;

        if (!email) {
            return setStateValue({ error: translate('please-enter-email') });
        }

        try {
            const redirectLink = environment.CALLBACK_DOMAIN + translate(appRoutes.resetPassword);
            await mutate({ variables: { email, redirectLink } });
            setStateValue({ message: translate('reset-password-msg') });
        } catch (error) {
            return setStateValue({ error: getErrorMessage(error) });
        }
    };

    const onChangeEmail = (email) => {
        setStateValue({
            email,
        });
    };

    const onChangePassword = (password) => {
        setStateValue({
            password,
        });
    };

    const isValid = () => {
        const { email, password } = state;
        return !!email && !!password;
    };

    const [onPressSocial, { socialLoading }] = useSocialLogin();

    const { loading } = state;

    return (
        <LoginStyle className="login">
            <ErrorMessageApollo email={state.email} error={state.error} />
            <Mutation
                mutation={LOGIN}
                variables={state}
                onError={(error) => {
                    setStateValue({ loading: false, error });
                }}
                onCompleted={async (data) => {
                    const {
                        signIn: { token },
                    } = data;
                    if (token) {
                        onLoggedIn({ token });
                    }
                }}
            >
                {(mutate) => {
                    return (
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                setStateValue({ loading: true });
                                mutate();
                            }}
                        >
                            <SmartButton
                                fullWidth
                                level="secondary"
                                onClick={onPressSocial('facebook')}
                                loading={socialLoading === 'facebook'}
                            >
                                <img src={fbLogo} alt="facebook logo" />
                                Continue with Facebook
                            </SmartButton>

                            <SmartButton
                                fullWidth
                                level="secondary"
                                onClick={onPressSocial('google')}
                                loading={socialLoading === 'google'}
                            >
                                <img src={googleLogo} alt="google logo" />
                                Continue with Google
                            </SmartButton>
                            <Row
                                middle
                                center
                                style={{
                                    width: '100%',
                                    margin: '1em 0',
                                }}
                            >
                                <Hr />
                                <BodySmall
                                    style={{
                                        margin: 0,
                                        padding: '0 1em',
                                        zIndex: 1,
                                        textTransform: 'lowercase',
                                    }}
                                >
                                    {translate('or')}
                                </BodySmall>
                                <Hr />
                            </Row>
                            <Input
                                v2
                                blurOnEnter={false}
                                label="Email"
                                placeholder="mail@email.com"
                                type="email"
                                autoComplete="email"
                                name="email"
                                onChange={(email) => onChangeEmail(email.trim())}
                                validation={(v) =>
                                    emailValidator.validate(v) ? null : 'Not a valid email'
                                }
                            />
                            <Input
                                v2
                                blurOnEnter={false}
                                label="Password"
                                placeholder="min. 6 characters"
                                type="password"
                                autoComplete="password"
                                name="password"
                                onChange={(password) => onChangePassword(password)}
                                validation={(v) => {
                                    if (!v) {
                                        return 'Please enter password';
                                    }
                                }}
                            />
                            <RowWrap right fullWidth>
                                <SmartButton
                                    glow
                                    fullWidth
                                    style={{ marginBottom: 0, marginTop: 12 }}
                                    active={isValid()}
                                    type={'submit'}
                                    loading={loading}
                                    name="email_login"
                                    onClick={(_) => {
                                        setStateValue({ loading: true });
                                        mutate();
                                    }}
                                >
                                    {translate('login')}
                                </SmartButton>

                                <Mutation mutation={REQUEST_PASSWORD_RESET}>
                                    {(forgot, { loading: loadingForgot }) => {
                                        return (
                                            <>
                                                <SmartButton
                                                    fullWidth
                                                    type="button"
                                                    level="tertiary"
                                                    name="forgot_password"
                                                    onClick={onRequestChangePassword(forgot)}
                                                    loading={loadingForgot}
                                                >
                                                    {translate('forgot') + '?'}
                                                </SmartButton>
                                                {state.message ? <p>{state.message}</p> : null}
                                            </>
                                        );
                                    }}
                                </Mutation>
                            </RowWrap>
                        </form>
                    );
                }}
            </Mutation>
        </LoginStyle>
    );
};

export default Login;
