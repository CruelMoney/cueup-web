import React, { Component } from 'react';
import { localize } from 'react-localize-redux';
import { Helmet } from 'react-helmet-async';
import { Mutation } from 'react-apollo';
import PropTypes from 'prop-types';
import { SmartButton } from 'components/Blocks';
import { Input } from 'components/FormComponents';
import RegistrationElement from 'components/common/RegistrationElement';
import Footer from '../../components/common/Footer';

import NumberedList from '../../components/common/NumberedList';
import { getErrorMessage } from '../../components/common/ErrorMessageApollo';
import { RESET_PASSWORD } from '../../components/gql';

class NotFound extends Component {
    componentDidMount() {
        document.body.classList.add('not-found');
    }

    componentWillUnmount() {
        document.body.classList.remove('not-found');
    }

    request = (mutate) => async (form, cb) => {
        try {
            const { password, repeatPassword } = form.values;

            if (password !== repeatPassword) {
                throw new Error('Passwords not matching');
            }

            const parsedUrl = new URL(window.location.href);
            const token = parsedUrl.searchParams.get('token');
            const passwordReset = parsedUrl.searchParams.get('passwordReset');

            if (!token || !passwordReset) {
                throw new Error('Token missing');
            }

            await mutate({ variables: { password, token } });
            cb(null, true);
            this.setState({
                msg: 'Your password has been reset',
            });
        } catch (error) {
            console.log({ error });
            const message = getErrorMessage(error);
            cb(message);
        }
    };

    render() {
        const { translate } = this.props;
        const siteTitle = translate('reset-password-title');
        const siteDescription = translate('reset-password-description');

        return (
            <div className="reset-password-screen">
                <Helmet>
                    <title>{siteTitle + ' | Cueup'}</title>
                    <meta name="description" content={siteDescription} />

                    <meta property="og:title" content={siteTitle + ' | Cueup'} />
                    <meta property="og:description" content={siteDescription} />

                    <meta name="twitter:title" content={siteTitle + ' | Cueup'} />
                    <meta name="twitter:description" content={siteDescription} />
                </Helmet>
                <div className="container">
                    <div className="signup fix-top-mobile">
                        <h1 style={{ marginBottom: '32px' }}>{siteTitle}</h1>
                        <Mutation mutation={RESET_PASSWORD}>
                            {(mutate, { loading }) => {
                                return (
                                    <form name={'reset-password-form'}>
                                        <NumberedList>
                                            <RegistrationElement label="New password" active={true}>
                                                <Input
                                                    big
                                                    type="password"
                                                    name="password"
                                                    validate={['required']}
                                                    placeholder="Min. 6 characters"
                                                    label={translate('Your password')}
                                                />
                                            </RegistrationElement>
                                            <RegistrationElement
                                                label="Repeat password"
                                                active={true}
                                            >
                                                <Input
                                                    big
                                                    type="password"
                                                    name="repeatPassword"
                                                    validate={['required']}
                                                    placeholder="Something super secret"
                                                    label={translate('Repeat password')}
                                                />
                                            </RegistrationElement>
                                        </NumberedList>

                                        <SmartButton
                                            glow
                                            type="submit"
                                            loading={loading}
                                            name="reset-password"
                                            onClick={this.request(mutate)}
                                        >
                                            <div style={{ minWidth: '100px' }}>
                                                {translate('Reset')}
                                            </div>
                                        </SmartButton>
                                        {this.state.msg ? (
                                            <div
                                                style={{
                                                    textAlign: 'center',
                                                }}
                                            >
                                                <p
                                                    style={{
                                                        fontSize: '20px',
                                                    }}
                                                >
                                                    {this.state.msg}
                                                </p>
                                            </div>
                                        ) : null}
                                    </form>
                                );
                            }}
                        </Mutation>
                    </div>
                </div>
                <Footer
                    color={'#31DAFF'}
                    noSkew={true}
                    firstTo={translate('routes./')}
                    secondTo={translate('routes./signup')}
                    firstLabel={translate('arrange-event')}
                    secondLabel={translate('become-dj')}
                    title={translate('ready-to-get-started')}
                    subTitle={translate('arrange-event-or-become-dj')}
                />
            </div>
        );
    }
}

export default localize(NotFound, 'locale');
