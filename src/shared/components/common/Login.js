import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import emailValidator from 'email-validator';

import { withRouter } from 'react-router-dom';
import { Mutation, Query } from 'react-apollo';
import addTranslate from 'components/higher-order/addTranslate';
import { SecondaryButton, SmartButton, Row, RowWrap } from 'components/Blocks';
import { LOGIN, REQUEST_PASSWORD_RESET, ME } from '../gql';
import * as c from '../../constants/constants';
import { authService } from '../../utils/AuthService';
import { Input } from '../FormComponents';
import ErrorMessageApollo, { getErrorMessage } from './ErrorMessageApollo';

class Login extends PureComponent {
    displayName = 'Login';

    static defaultProps = {
        redirect: true,
    };

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            isValid: false,
            isLoading: false,
            error: props.error,
            message: '',
        };
    }

    onRequestChangePassword = (mutate) => async (form, callback) => {
        const { translate } = this.props;
        const { email } = this.state;

        if (!email) {
            return callback(translate('please-enter-email'));
        }

        try {
            const redirectLink =
                c.Environment.CALLBACK_DOMAIN + translate('routes./reset-password');
            await mutate({ variables: { email, redirectLink } });
            this.setState({ message: translate('reset-password-msg') });
            callback(null);
        } catch (error) {
            return callback(getErrorMessage(error));
        }
    };

    onChangeEmail = (email) => {
        this.setState({
            email,
        });
    };

    onChangePassword = (password) => {
        this.setState({
            password,
        });
    };

    redirectAfterLogin = (user) => {
        if (user && user.user_metadata && user.user_metadata.permaLink) {
            this.props.history.push(`/user/${user.user_metadata.permaLink}/profile`);
        }
    };

    isValid = () => {
        const { email, password } = this.state;
        return !!email && !!password;
    };

    render() {
        const { isLoading } = this.state;
        const { translate, onLogin } = this.props;

        return (
            <Query query={ME}>
                {({ refetch }) => (
                    <div className="login">
                        <Mutation
                            mutation={LOGIN}
                            variables={this.state}
                            onError={(error) => {
                                console.log({ error });
                                this.setState({ isLoading: false });
                            }}
                            onCompleted={async ({ signIn: { token } }) => {
                                if (token) {
                                    authService.setSession(token);
                                    await refetch();
                                    onLogin && (await onLogin());
                                }
                                this.setState({ isLoading: false });
                            }}
                        >
                            {(mutate, { error }) => {
                                return (
                                    <form onSubmit={(_) => mutate()}>
                                        <div>
                                            <Input
                                                blurOnEnter={false}
                                                label="Email"
                                                placeholder="mail@email.com"
                                                type="email"
                                                autoComplete="email"
                                                name="email"
                                                onChange={(email) =>
                                                    this.onChangeEmail(email.trim())
                                                }
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
                                                onChange={(password) =>
                                                    this.onChangePassword(password)
                                                }
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
                                                active={this.isValid()}
                                                disabled={!this.isValid()}
                                                type={'submit'}
                                                loading={isLoading}
                                                name="email_login"
                                                onClick={(_) => {
                                                    this.setState({ isLoading: true });
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
                                                                type="button"
                                                                level="tertiary"
                                                                name="forgot_password"
                                                                onClick={this.onRequestChangePassword(
                                                                    forgot
                                                                )}
                                                                loading={loadingForgot}
                                                            >
                                                                {translate('forgot') + '?'}
                                                            </SmartButton>
                                                            {this.state.message ? (
                                                                <p>{this.state.message}</p>
                                                            ) : null}
                                                        </>
                                                    );
                                                }}
                                            </Mutation>
                                        </RowWrap>
                                        <ErrorMessageApollo
                                            email={this.state.email}
                                            error={error}
                                        />
                                    </form>
                                );
                            }}
                        </Mutation>

                        <p
                            style={{
                                fontSize: '12px',
                                lineHeight: '1.5em',
                                textAlign: 'left',
                            }}
                        >
                            {translate('removed-facebook')}
                        </p>
                    </div>
                )}
            </Query>
        );
    }
}

Login.childContextTypes = {
    color: PropTypes.string,
};

const SmartLogin = withRouter(addTranslate(Login));

export default (props) => <SmartLogin {...props} />;
