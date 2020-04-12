import React, { useState } from 'react';
import { animated, useTransition } from 'react-spring';
import emailValidator from 'email-validator';
import { Input } from 'components/FormComponents';
import { SmartButton } from 'components/Blocks';
import useSocialLogin from 'components/hooks/useSocialLogin';
import appStoreBadge from '../../../../assets/app-store-badge.svg';
import Button from '../Button';
import fbLogo from '../../../../assets/icons/fb.svg';
import googleLogo from '../../../../assets/icons/google.svg';
import './index.css';

export const Signup = ({ active, close }) => {
    const [form, setForm] = useState({});

    const transitions = useTransition(active, null, {
        from: { opacity: 0, transform: 'translateY(-40px) scale(0.9) rotateX(-10deg)' },
        enter: { opacity: 1, transform: 'translateY(0px) scale(1) rotateX(0deg)' },
        leave: { opacity: 0, transform: 'translateY(-40px) scale(0.9) rotateX(-10deg)' },
    });

    const updateForm = (data) => setForm((ff) => ({ ...ff, ...data }));

    const [onPressSocial, { socialLoading }] = useSocialLogin();

    if (!active) {
        return null;
    }

    return (
        <div className="signup-wrapper">
            <div onClick={close} className="close-button">
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
                                <form>
                                    <Input
                                        blurOnEnter={false}
                                        label="Email"
                                        placeholder="mail@email.com"
                                        type="email"
                                        autoComplete="email"
                                        name="email"
                                        onChange={(email) => updateForm({ email: email.trim() })}
                                        validation={(v) =>
                                            emailValidator.validate(v) ? null : 'Not a valid email'
                                        }
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
                                    />
                                    <Input
                                        blurOnEnter={false}
                                        label="DJ name"
                                        placeholder="DJ Name Generator"
                                        name="dj-name"
                                        onChange={(artistName) => updateForm({ artistName })}
                                    />
                                    <Button>Continue</Button>
                                    <Hr />
                                </form>
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
                            top: '-9px',
                            marginRight: '18px',
                        }}
                        alt="Get it on App store"
                        src={appStoreBadge}
                    />
                </a>
            </div>
        </div>
    );
};

const Hr = () => {
    return (
        <div
            style={{
                width: '100%',
                margin: '2em 0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
            }}
        >
            <hr
                style={{
                    borderTop: '1px solid #e9ecf0',
                    margin: '0',
                    width: '100%',
                    color: '#fff',
                }}
            />
            <p
                style={{
                    margin: 0,
                    padding: '0 1em',
                    backgroundColor: '#fff',
                    position: 'absolute',
                    zIndex: 1,
                    textTransform: 'lowercase',
                    opacity: 1,
                    marginTop: '-5px',
                }}
            >
                OR
            </p>
        </div>
    );
};
