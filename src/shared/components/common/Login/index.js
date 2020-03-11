import React, { useState, useEffect, useCallback } from 'react';
import PropTypes from 'prop-types';
import emailValidator from 'email-validator';

import { withRouter, NavLink } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import styled from 'styled-components';
import addTranslate from 'components/higher-order/addTranslate';
import {
    SecondaryButtonLink,
    SmartButton,
    Row,
    RowWrap,
    Hr,
    Col,
    SecondaryButton,
} from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { LOGIN, REQUEST_PASSWORD_RESET, ME } from '../../gql';
import * as c from '../../../constants/constants';
import { authService } from '../../../utils/AuthService';
import { Input } from '../../FormComponents';
import ErrorMessageApollo, { getErrorMessage } from '../ErrorMessageApollo';
import fbLogo from './fb.svg';
import googleLogo from './google.svg';

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

const Login = ({ redirect = false, error, translate, onLogin, history }) => {
    const [state, setState] = useState({
        email: '',
        password: '',
        isValid: false,
        error,
        message: '',
        loading: false,
    });

    const [socialLoading, setSocialLoading] = useState(null);

    const setStateValue = useCallback((data) => setState((s) => ({ ...s, ...data })), [setState]);

    useEffect(() => {
        const parsedUrl = new URL(window.location.href);
        const error = parsedUrl.searchParams.get('error');
        if (error) {
            setStateValue({ error });
        }
    }, [setStateValue]);

    const onRequestChangePassword = (mutate) => async (form, callback) => {
        const { email } = state;

        if (!email) {
            return setStateValue({ error: translate('please-enter-email') });
        }

        try {
            const redirectLink =
                c.Environment.CALLBACK_DOMAIN + translate('routes./reset-password');
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

    const onPressSocial = (social) => (e) => {
        e.preventDefault();
        setSocialLoading(social);
        const redirect = '?redirect=' + window.location.href;
        window.location.replace(
            process.env.REACT_APP_CUEUP_GQL_DOMAIN + '/auth/' + social + redirect
        );
    };

    const { loading } = state;

    return (
        <Query query={ME}>
            {({ refetch }) => (
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
                                authService.setSession(token);
                                await refetch();
                                onLogin && (await onLogin());
                                setStateValue({ loading: false, error: null });
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
                                    <div>
                                        <Input
                                            blurOnEnter={false}
                                            label="Email"
                                            placeholder="mail@email.com"
                                            type="email"
                                            autoComplete="email"
                                            name="email"
                                            onChange={(email) => onChangeEmail(email.trim())}
                                            validation={(v) =>
                                                emailValidator.validate(v)
                                                    ? null
                                                    : 'Not a valid email'
                                            }
                                        />
                                    </div>
                                    <div>
                                        <Input
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
                                    </div>
                                    <RowWrap right fullWidth>
                                        <SmartButton
                                            glow
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

                                        <Col
                                            middle
                                            center
                                            style={{
                                                width: '100%',
                                                margin: '2em 0',
                                            }}
                                        >
                                            <Hr />
                                            <BodySmall
                                                style={{
                                                    margin: 0,
                                                    padding: '0 1em',
                                                    backgroundColor: '#fff',
                                                    position: 'absolute',
                                                    zIndex: 1,
                                                    textTransform: 'lowercase',
                                                }}
                                            >
                                                {translate('or')}
                                            </BodySmall>
                                        </Col>

                                        <SmartButton
                                            level="secondary"
                                            onClick={onPressSocial('facebook')}
                                            loading={socialLoading === 'facebook'}
                                        >
                                            <img src={fbLogo} alt="facebook logo" />
                                            Continue with Facebook
                                        </SmartButton>

                                        <SmartButton
                                            level="secondary"
                                            onClick={onPressSocial('google')}
                                            loading={socialLoading === 'google'}
                                        >
                                            <img src={googleLogo} alt="google logo" />
                                            Continue with Google
                                        </SmartButton>

                                        <Mutation mutation={REQUEST_PASSWORD_RESET}>
                                            {(forgot, { loading: loadingForgot }) => {
                                                return (
                                                    <>
                                                        <SmartButton
                                                            type="button"
                                                            level="tertiary"
                                                            name="forgot_password"
                                                            onClick={onRequestChangePassword(
                                                                forgot
                                                            )}
                                                            loading={loadingForgot}
                                                        >
                                                            {translate('forgot') + '?'}
                                                        </SmartButton>
                                                        {state.message ? (
                                                            <p>{state.message}</p>
                                                        ) : null}
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
            )}
        </Query>
    );
};

const SmartLogin = withRouter(addTranslate(Login));

export default (props) => <SmartLogin {...props} />;
