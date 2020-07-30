import React from 'react';
import emailValidator from 'email-validator';
import styled from 'styled-components';
import { Row, TeritaryButton, SmartButton, Hr, Col } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { Input, InputRow } from 'components/FormComponents';
import useSocialLogin from 'components/hooks/useSocialLogin';
import fbLogo from '../../../assets/icons/fb.svg';
import googleLogo from '../../../assets/icons/google.svg';
import { RequestSection } from './RequestForm';

const LoginStyle = styled.div`
    flex-direction: row;
    display: flex;
    justify-content: space-between;
    margin: 30px -5px;
    button {
        max-width: 100%;
        width: 100%;
        margin: 0 5px;
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

const Step4 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
    loading,
    user,
}) => {
    const submit = (e) => {
        e.preventDefault();
        next();
    };
    const [onPressSocial, { socialLoading }] = useSocialLogin();

    const isLoggedIn = user;

    return (
        <form onSubmit={submit} style={{ width: '600px' }}>
            <h3 dangerouslySetInnerHTML={{ __html: translate('requestForm:step-4.header') }} />

            {!isLoggedIn && (
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
                    </LoginStyle>

                    <Col
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
                                backgroundColor: '#fff',
                                position: 'absolute',
                                zIndex: 1,
                                textTransform: 'lowercase',
                            }}
                        >
                            {translate('or')}
                        </BodySmall>
                    </Col>
                </>
            )}

            <Input
                label={translate('requestForm:step-4.contact-name')}
                name="contactName"
                placeholder={translate('first-last')}
                type="text"
                autoComplete="name"
                defaultValue={form.contactName}
                validation={(v) => {
                    if (!v) {
                        return 'Please enter name';
                    }
                    const [firstName, ...lastName] = v.split(' ');
                    if (!firstName || !lastName.some((s) => !!s.trim())) {
                        return 'Please enter both first and last name';
                    }
                }}
                onSave={(contactName) => handleChange({ contactName })}
                registerValidation={registerValidation('contactName')}
                unregisterValidation={unregisterValidation('contactName')}
            >
                <BodySmall>{translate('requestForm:step-4.contact-name-description')}</BodySmall>
            </Input>

            <InputRow small>
                <Input
                    labelStyle={{ marginBottom: 0 }}
                    type="email"
                    name="contactEmail"
                    label={translate('requestForm:step-4.contact-email')}
                    autoComplete="email"
                    placeholder="Email"
                    defaultValue={form.contactEmail}
                    validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                    onSave={(contactEmail) => handleChange({ contactEmail })}
                    registerValidation={registerValidation('contactEmail')}
                    unregisterValidation={unregisterValidation('contactEmail')}
                >
                    <BodySmall>
                        {translate('requestForm:step-4.contact-email-description')}
                    </BodySmall>
                </Input>
            </InputRow>

            <Hr style={{ margin: '15px 0' }} />

            <Input
                type="tel"
                label={translate('requestForm:step-4.contact-phone')}
                placeholder={translate('optional')}
                name="contactPhone"
                defaultValue={form.contactPhone}
                onSave={(contactPhone) => handleChange({ contactPhone })}
            >
                <BodySmall>{translate('requestForm:step-4.contact-phone-description')}</BodySmall>
            </Input>

            <Row right>
                <TeritaryButton type="button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <SmartButton data-cy="submit-event" type="submit" loading={loading}>
                    Show DJs
                </SmartButton>
            </Row>
        </form>
    );
};

export default Step4;
