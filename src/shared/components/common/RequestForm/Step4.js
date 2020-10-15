import React, { useState } from 'react';
import emailValidator from 'email-validator';
import styled from 'styled-components';
import mailIcon from '@iconify/icons-ion/mail';
import { InlineIcon } from '@iconify/react';
import { Row, TeritaryButton, SmartButton } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { Input, InputRow } from 'components/FormComponents';
import useSocialLogin from 'components/hooks/useSocialLogin';
import useTranslate from 'components/hooks/useTranslate';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import fbLogo from '../../../assets/icons/fb.svg';
import googleLogo from '../../../assets/icons/google.svg';
import content from './content.json';

const LoginStyle = styled.div`
    flex-direction: row;
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    margin: 30px -5px 10px -5px;
    button {
        max-width: 100%;
        min-width: 200px;
        flex: 1;
        margin: 2.5px 5px;
        > span {
            width: 100%;
        }
        > span:nth-child(2) {
            width: auto;
            position: absolute;
            right: 1em;
        }
        img,
        svg {
            position: absolute;
            left: 0px;
            height: 20px;
            width: 20px;
            top: 50%;
            transform: translateY(-50%);
        }
    }
`;

const Step4 = ({
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
    loading,
    user,
    style,
    hideHeadline,
}) => {
    const { translate } = useNamespaceContent(content, 'requestForm');

    const isLoggedIn = user;

    const [useEmail, setUseEmail] = useState(isLoggedIn);

    const submit = (e) => {
        e.preventDefault();
        next();
    };
    const [onPressSocial, { socialLoading }] = useSocialLogin();

    return (
        <form onSubmit={submit} style={{ width: '600px', ...style }}>
            {!useEmail && !hideHeadline && (
                <h3 dangerouslySetInnerHTML={{ __html: translate('requestForm:step-4.header') }} />
            )}
            {!isLoggedIn && !useEmail && (
                <>
                    <LoginStyle>
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

                        <SmartButton level="secondary" onClick={() => setUseEmail(true)}>
                            <InlineIcon
                                icon={mailIcon}
                                style={{ fontSize: '20px' }}
                                color="#98A4B3"
                            />
                            Continue with email
                        </SmartButton>
                    </LoginStyle>
                </>
            )}
            {useEmail && (
                <>
                    <Input
                        v2
                        label={translate('requestForm:step-4.contact-name')}
                        name="contactName"
                        placeholder={translate('first-last')}
                        type="text"
                        autoComplete="name"
                        defaultValue={form.contactName}
                        onSave={(contactName) => handleChange({ contactName })}
                    />

                    <InputRow small>
                        <Input
                            v2
                            type="email"
                            name="contactEmail"
                            label={translate('requestForm:step-4.contact-email')}
                            autoComplete="email"
                            placeholder="Email"
                            defaultValue={form.contactEmail}
                            validation={(v) =>
                                emailValidator.validate(v) ? null : 'Not a valid email'
                            }
                            onSave={(contactEmail) => handleChange({ contactEmail })}
                            registerValidation={registerValidation('contactEmail')}
                            unregisterValidation={unregisterValidation('contactEmail')}
                        >
                            <BodySmall>
                                {translate('requestForm:step-4.contact-email-description')}
                            </BodySmall>
                        </Input>
                    </InputRow>

                    <Input
                        v2
                        type="tel"
                        label={translate('requestForm:step-4.contact-phone')}
                        placeholder={translate('optional')}
                        name="contactPhone"
                        defaultValue={form.contactPhone}
                        onSave={(contactPhone) => handleChange({ contactPhone })}
                    >
                        <BodySmall>
                            {translate('requestForm:step-4.contact-phone-description')}
                        </BodySmall>
                    </Input>

                    <Row right>
                        <TeritaryButton
                            type="button"
                            onClick={useEmail ? () => setUseEmail(false) : back}
                        >
                            {translate('back')}
                        </TeritaryButton>
                        {useEmail && (
                            <SmartButton
                                data-cy="submit-event"
                                type="submit"
                                loading={loading}
                                onClick={submit}
                            >
                                Show DJs
                            </SmartButton>
                        )}
                    </Row>
                </>
            )}
            {!useEmail && (
                <BodySmall
                    style={{
                        textAlign: 'center',
                        marginBottom: '12px',
                    }}
                    className="terms_link"
                    dangerouslySetInnerHTML={{ __html: translate('terms-message-event') }}
                />
            )}

            {!useEmail && (
                <TeritaryButton
                    type="button"
                    style={{ minWidth: 0 }}
                    onClick={useEmail ? () => setUseEmail(false) : back}
                >
                    {translate('back')}
                </TeritaryButton>
            )}
        </form>
    );
};

export default Step4;
