import React from 'react';
import addTranslate from 'components/higher-order/addTranslate';
import { Body } from 'components/Text';
import { RequestSection } from './RequestForm';

const Step5 = ({ translate }) => {
    return (
        <div>
            <h3>{translate('request-form.step-5.header')}</h3>
            <RequestSection>
                <Body center>{translate('request-form.succes-message')}</Body>
            </RequestSection>
        </div>
    );
};

export default addTranslate(Step5);
