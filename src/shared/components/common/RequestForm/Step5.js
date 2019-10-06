import React from 'react';
import emailValidator from 'email-validator';
import { Row, TeritaryButton, PrimaryButton } from 'components/Blocks';
import { BodySmall, Body } from 'components/Text';
import { Input } from 'components/FormComponents';
import addTranslate from 'components/higher-order/addTranslate';

const Step5 = ({
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
            <h3>{translate('request-form.step-5.header')}</h3>
            <section>
                <Body center>{translate('request-form.succes-message')}</Body>
            </section>
        </div>
    );
};

export default addTranslate(Step5);
