import React, { PureComponent } from 'react';
import { Row, TeritaryButton, PrimaryButton } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { Input } from 'components/FormComponents';
import addTranslate from 'components/higher-order/addTranslate';

const Step4 = ({
    translate,
    form,
    next,
    back,
    handleChange,
    registerValidation,
    unregisterValidation,
}) => {
    return (
        <div>
            <form>
                <h3>{translate('request-form.step-4.header')}</h3>
                <section>
                    <Input
                        label={translate('request-form.step-4.contact-name')}
                        name="contactName"
                        placeholder={translate('first-last')}
                        validate={['required', 'lastName']}
                    />
                    <BodySmall>
                        {translate('request-form.step-4.contact-name-description')}
                    </BodySmall>
                </section>

                <section>
                    <Input
                        type="tel"
                        label={translate('request-form.step-4.contact-phone')}
                        placeholder={translate('optional')}
                        name="contactPhone"
                        validate={[]}
                    />
                    <BodySmall>
                        {translate('request-form.step-4.contact-phone-description')}
                    </BodySmall>
                </section>
                <section>
                    <Input
                        type="email"
                        name="contactEmail"
                        label={translate('request-form.step-4.contact-email')}
                        autoComplete="email"
                        placeholder="Email"
                        validate={['required', 'email']}
                    />
                    <BodySmall>
                        {translate('request-form.step-4.contact-email-description')}
                    </BodySmall>
                </section>
                <Row right style={{ marginTop: '12px' }}>
                    <TeritaryButton type="button" className="back-button" onClick={back}>
                        {translate('back')}
                    </TeritaryButton>
                    <PrimaryButton type="button" onClick={next}>
                        {translate('get-offers')}
                    </PrimaryButton>
                </Row>
            </form>
            <BodySmall style={{ textAlign: 'center' }} className="terms_link">
                {translate('terms-message')}
            </BodySmall>
        </div>
    );
};

export default addTranslate(Step4);
