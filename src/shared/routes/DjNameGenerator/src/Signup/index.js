import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import emailValidator from 'email-validator';
import { useMutation } from 'react-apollo';
import * as Sentry from '@sentry/react';
import { Input } from 'components/FormComponents';
import { trackSignup } from 'utils/analytics';

import { SmartButton } from 'components/Blocks';
import useSocialLogin from 'components/hooks/useSocialLogin';
import useOnLoggedIn from 'components/hooks/useOnLoggedIn';
import { useServerContext } from 'components/hooks/useServerContext';
import { useForm } from 'components/hooks/useForm';
import { handleError } from 'components/common/ErrorMessageApollo';
import appStoreBadge from '../../../../assets/app-store-badge.svg';

import fbLogo from '../../../../assets/icons/fb.svg';
import googleLogo from '../../../../assets/icons/google.svg';
import { SLIM_SIGNUP } from '../gql';

import './index.css';

export const Signup = ({ name, history }) => {
    const { environment } = useServerContext();

    const transitions = useTransition(true, null, {
        from: { opacity: 0, transform: 'translateY(-40px) scale(0.9) rotateX(-10deg)' },
        enter: { opacity: 1, transform: 'translateY(0px) scale(1) rotateX(0deg)' },
        leave: { opacity: 0, transform: 'translateY(-40px) scale(0.9) rotateX(-10deg)' },
    });

    const [onPressSocial, { socialLoading }] = useSocialLogin({
        redirect: environment.WEBSITE_URL + '/complete-signup',
    });

    return (
        <div className="signup-wrapper">
            <div className="inner-content">
                <div onClick={() => history.replace('/dj-name-generator')} className="close-button">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="512"
                        height="512"
                        viewBox="0 0 512 512"
                    >
                        <path d="M256,48C141.31,48,48,141.31,48,256s93.31,208,208,208,208-93.31,208-208S370.69,48,256,48Zm75.31,260.69a16,16,0,1,1-22.62,22.62L256,278.63l-52.69,52.68a16,16,0,0,1-22.62-22.62L233.37,256l-52.68-52.69a16,16,0,0,1,22.62-22.62L256,233.37l52.69-52.68a16,16,0,0,1,22.62,22.62L278.63,256Z" />
                    </svg>
                </div>
                {transitions.map(
                    ({ item, key, props: style }) =>
                        item && (
                            <animated.div key={key} style={style} className="card">
                                <div className="signup-header">
                                    <span className="adjecent">signup</span>
                                    <h2>
                                        Apply to become DJ at Cueup.
                                        <span>Get more gigs.</span>
                                    </h2>

                                    <a href={'/become-dj'}>
                                        Read more
                                        <svg
                                            fill="#111"
                                            width="18px"
                                            height="18px"
                                            viewBox="0 0 1024 1024"
                                            rotate="0"
                                        >
                                            <path d="M569.8 825.2l276.2-268c12-11.6 18-27.4 18-44.8v-0.8c0-17.4-6-33.2-18-44.8l-276.2-268c-24-25-62.6-25-86.4 0s-23.8 65.4 0 90.4l166 158.8h-428c-34-0-61.4 28.6-61.4 64 0 36 27.4 64 61.2 64h428l-166 158.8c-23.8 25-23.8 65.4 0 90.4 24 25 62.6 25 86.6 0z" />
                                        </svg>
                                    </a>
                                </div>

                                <div>
                                    <SignupForm name={name} />
                                    <Hr />

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
                                </div>
                            </animated.div>
                        )
                )}

                <div className="app-buttons">
                    <a href="https://play.google.com/store/apps/details?id=io.cueup.gigs&utm_source=website&pcampaignid=MKT-Other-global-all-co-prtnr-py-PartBadge-Mar2515-1">
                        <img
                            style={{
                                height: '60px',
                            }}
                            alt="Get it on Google Play"
                            src="https://play.google.com/intl/en_us/badges/images/generic/en_badge_web_generic.png"
                        />
                    </a>
                    <a href="https://apps.apple.com/us/app/cueup-gigs/id1458267647?mt=8">
                        <img
                            style={{
                                height: '40px',
                                marginRight: '18px',
                            }}
                            alt="Get it on App store"
                            src={appStoreBadge}
                        />
                    </a>
                </div>
            </div>
        </div>
    );
};

const SignupForm = ({ name }) => {
    const onLoggedIn = useOnLoggedIn();
    const { environment } = useServerContext();
    const [form, setForm] = useState({ artistName: name });
    const updateForm = (data) => setForm((ff) => ({ ...ff, ...data }));

    const [loading, setLoading] = useState(false);

    const [mutate] = useMutation(SLIM_SIGNUP, {
        onError: handleError,
    });

    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const signup = async (e) => {
        e.preventDefault();

        const errors = runValidations(true);

        if (errors?.length) {
            return;
        }
        try {
            setLoading(true);
            const variables = {
                ...form,
                redirectLink: environment.WEBSITE_URL,
            };

            // can be update or signup
            const { data } = await mutate({ variables });

            let token = null;

            trackSignup();
            token = data?.signUpToken?.token;

            if (token) {
                await onLoggedIn({ token });
            }
        } catch (err) {
            console.log(err);
            Sentry.captureException(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={signup}>
            <Input
                blurOnEnter={false}
                label="DJ name"
                placeholder="DJ Name Generator"
                name="aristName"
                value={form.artistName}
                onChange={(artistName) => updateForm({ artistName })}
            />
            <Input
                blurOnEnter={false}
                label="Email"
                placeholder="mail@email.com"
                type="email"
                autoComplete="email"
                name="email"
                onChange={(email) => updateForm({ email: email.trim() })}
                validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                registerValidation={registerValidation('email')}
                unregisterValidation={unregisterValidation('email')}
            />
            <Input
                blurOnEnter={false}
                label="Password"
                placeholder="min. 6 characters"
                type="password"
                autoComplete="password"
                name="password"
                onChange={(password) => updateForm({ password })}
                validation={(v) => {
                    if (!v) {
                        return 'Please enter password';
                    }
                }}
                registerValidation={registerValidation('password')}
                unregisterValidation={unregisterValidation('password')}
            />
            <div style={{ flex: 1 }} />
            <SmartButton loading={loading} type="submit">
                Continue
            </SmartButton>
        </form>
    );
};

const Hr = () => {
    return (
        <div className="divider">
            <hr />
            <p>OR</p>
        </div>
    );
};
