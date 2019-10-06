import React, { useState } from 'react';
import moment from 'moment-timezone';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { PrimaryButton, Card, CardShadow, Col } from 'components/Blocks';
import { useForm } from 'components/FormComponents';
import Popup from '../Popup';
import Login from '../Login';
import addTranslate from '../../../components/higher-order/addTranslate';
import ErrorMessageApollo from '../ErrorMessageApollo';
import Progress from './ProgressSubmit';
import content from './content.json';
import Step1 from './Step1';
import Step2 from './Step2';

import { CREATE_EVENT } from './gql';
import Step3 from './Step3';
import Step4 from './Step4';

const MainForm = ({ translate, onSubmit }) => {
    const [activeStep, setActiveStep] = useState(2);
    const [showPopup, setShowPopup] = useState(false);
    const [mutate, { loading, error }] = useMutation(CREATE_EVENT);

    const [form, setForm] = useState({
        date: moment(),
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const formToEvent = (form) => {
        return {
            ...form,
            guestsCount: form.guests[0],
            timeZone: form.timeZoneId,
        };
    };

    const handleChange = (data) => {
        console.log({ data });
        setForm((f) => ({ ...f, ...data }));
    };

    const next = (data) => {
        const errors = runValidations();
        console.log({ errors });
        if (errors.length === 0) {
            handleChange(data);
            setActiveStep((s) => s + 1);
        }
    };

    const back = () => {
        setActiveStep((s) => s - 1);
    };

    const setProgress = (step) => {
        if (step + 1 < activeStep) {
            setActiveStep(step);
        }
    };
    return (
        <div className="request-form">
            <Popup width="380px" showing={showPopup} onClickOutside={() => setShowPopup(false)}>
                <div>
                    <p style={{ marginBottom: '20px' }}>
                        {translate('request-form.email-exists-message')}
                    </p>
                    <Login redirect={false} onLogin={() => setShowPopup(false)} />
                </div>
            </Popup>
            <div className="request-columns">
                <Wrapper style={{ padding: 0 }}>
                    <Progress setProgress={setProgress} currentStep={activeStep - 1} />
                </Wrapper>
                <Wrapper>
                    <RequestCard>
                        {activeStep === 1 && (
                            <Step1
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                            />
                        )}
                        {activeStep === 2 && (
                            <Step2
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                                back={back}
                            />
                        )}

                        {activeStep === 3 && (
                            <Step3
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                                back={back}
                            />
                        )}

                        {activeStep === 4 && (
                            <Step4
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                                back={back}
                            />
                        )}

                        <ErrorMessageApollo
                            center
                            error={error}
                            onFoundCode={(code) => {
                                if (code === 'UNAUTHENTICATED') {
                                    showPopup(true);
                                }
                            }}
                        />
                    </RequestCard>
                    <CardShadow />
                </Wrapper>
            </div>
        </div>
    );
};

const Wrapper = styled(Col)`
    position: relative;
    margin: auto;
    max-width: 600px;
    box-sizing: border-box;
    .error,
    .errors {
        font-size: 14px;
    }
`;

const RequestCard = styled(Card)`
    padding: 24px 30px;
    form {
        width: 100%;
    }
`;

export default addTranslate(MainForm, content);
