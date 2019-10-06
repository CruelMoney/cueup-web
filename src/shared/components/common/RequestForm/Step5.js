import React from 'react';
import addTranslate from 'components/higher-order/addTranslate';
import { Body } from 'components/Text';

const Step5 = ({ translate }) => {
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
