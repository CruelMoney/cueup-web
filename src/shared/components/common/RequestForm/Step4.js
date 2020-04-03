import React from 'react';
import emailValidator from 'email-validator';
import { Row, TeritaryButton, PrimaryButton, SmartButton } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { Input, InputRow } from 'components/FormComponents';
import { RequestSection } from './RequestForm';

const Step4 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
    loading,
}) => {
    const submit = (e) => {
        e.preventDefault();
        next();
    };

    return (
        <div>
            <form onSubmit={submit}>
                <h3>{translate('requestForm:step-4.header')}</h3>
                <RequestSection>
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
                        <BodySmall>
                            {translate('requestForm:step-4.contact-name-description')}
                        </BodySmall>
                    </Input>
                </RequestSection>

                <RequestSection>
                    <Input
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
                </RequestSection>
                <RequestSection>
                    <InputRow small>
                        <Input
                            half
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
                        />
                        <Input
                            half
                            type="email"
                            name="contactEmailConfirm"
                            label="Confirm"
                            autoComplete="email"
                            placeholder="Confirm Email"
                            defaultValue={form.contactEmailConfirm}
                            validation={(v) => {
                                if (v?.toUpperCase() !== form.contactEmail?.toUpperCase()) {
                                    return 'Emails not matching';
                                }
                                return null;
                            }}
                            onSave={(contactEmailConfirm) => handleChange({ contactEmailConfirm })}
                            registerValidation={registerValidation('contactEmailConfirm')}
                            unregisterValidation={unregisterValidation('contactEmailConfirm')}
                        />
                    </InputRow>
                    <BodySmall>
                        {translate('requestForm:step-4.contact-email-description')}
                    </BodySmall>
                </RequestSection>

                <Row right style={{ marginTop: '12px' }}>
                    <TeritaryButton type="button" onClick={back}>
                        {translate('back')}
                    </TeritaryButton>
                    <SmartButton data-cy="submit-event" type="submit" loading={loading}>
                        {translate('get-offers')}
                    </SmartButton>
                </Row>
            </form>
        </div>
    );
};

export default Step4;
