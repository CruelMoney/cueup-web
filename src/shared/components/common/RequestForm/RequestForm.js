import React, { useState } from 'react';
import moment from 'moment-timezone';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Card, CardShadow, Col } from 'components/Blocks';
import { useForm } from 'components/FormComponents';
import { BodySmall } from 'components/Text';
import { useCreateEvent } from 'actions/EventActions';
import Popup from '../Popup';
import Login from '../Login';
import addTranslate from '../../../components/higher-order/addTranslate';
import ErrorMessageApollo from '../ErrorMessageApollo';
import Progress from './ProgressSubmit';
import content from './content.json';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

const MainForm = ({ translate }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [showPopup, setShowPopup] = useState(false);

    const [form, setForm] = useState({
        date: moment(),
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const [mutate, { loading, error }] = useCreateEvent(form);

    const createEvent = async () => {
        const errors = runValidations();
        if (errors.length === 0) {
            await mutate();
            setActiveStep((s) => s + 1);
        }
    };

    const handleChange = (data) => {
        setForm((f) => ({ ...f, ...data }));
    };

    const next = (data) => {
        const errors = runValidations();
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
                                next={createEvent}
                                back={back}
                                loading={loading}
                            />
                        )}

                        {activeStep === 5 && (
                            <Step5
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
                {activeStep === 4 && (
                    <Wrapper>
                        <BodySmall style={{ textAlign: 'center' }} className="terms_link">
                            {translate('terms-message-event')}
                        </BodySmall>
                    </Wrapper>
                )}
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
    .errors p {
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
