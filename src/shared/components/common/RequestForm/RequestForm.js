import React, { useState, useEffect } from 'react';
import moment from 'moment-timezone';
import styled from 'styled-components';
import { Card, CardShadow, Col, TeritaryButton, Hr, LinkButton } from 'components/Blocks';
import { LabelHalf, InputRow } from 'components/FormComponents';
import { BodySmall, TitleClean } from 'components/Text';
import { useCreateEvent } from 'actions/EventActions';
import { useForm } from 'components/hooks/useForm';
import Login from '../Login';
import addTranslate from '../../../components/higher-order/addTranslate';
import ErrorMessageApollo from '../ErrorMessageApollo';
import usePushNotifications from '../../hooks/usePushNotifications';
import Progress from './ProgressSubmit';
import content from './content.json';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';

const MainForm = ({ translate, initialCity, countries }) => {
    const [activeStep, setActiveStep] = useState(1);
    const [showLogin, setShowLogin] = useState(false);
    const { pushIsEnabled } = usePushNotifications();

    // defaults
    const [form, setForm] = useState({
        date: moment(),
        locationName: initialCity,
        startMinute: 21 * 60,
        endMinute: 27 * 60,
        guestsCount: 100,
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);
    const [error, setError] = useState();
    const [mutate, { loading, data: createdEventData }] = useCreateEvent(form);

    const createEvent = async () => {
        const errors = runValidations();
        if (errors.length === 0) {
            const { error } = await mutate();
            if (!error) {
                setActiveStep((s) => s + 1);
            } else {
                setError(error);
            }
        }
    };

    const handleChange = (data) => {
        setError(null);
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
            <div className="request-columns">
                <Wrapper style={{ padding: 0 }}>
                    <Progress setProgress={setProgress} currentStep={activeStep - 1} />
                </Wrapper>
                <Wrapper>
                    <RequestCard>
                        {showLogin && (
                            <>
                                <TitleClean center>Login</TitleClean>
                                <BodySmall>
                                    {translate('request-form.email-exists-message')}
                                </BodySmall>
                                <Login
                                    redirect={false}
                                    onLogin={() => {
                                        setShowLogin(false);
                                    }}
                                />
                                <Hr margin />
                                <LinkButton onClick={() => setShowLogin(false)}>Back</LinkButton>
                            </>
                        )}

                        {!showLogin && activeStep === 1 && (
                            <Step1
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                                countries={countries}
                            />
                        )}
                        {!showLogin && activeStep === 2 && (
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

                        {!showLogin && activeStep === 3 && (
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

                        {!showLogin && activeStep === 4 && (
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

                        {!showLogin && activeStep === 5 && (
                            <Step5
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                                back={back}
                                pushIsEnabled={pushIsEnabled}
                                userId={createdEventData?.createEvent?.organizer?.id}
                            />
                        )}

                        <ErrorMessageApollo
                            center
                            error={error}
                            onFoundCode={(code) => {
                                if (code === 'UNAUTHENTICATED') {
                                    setShowLogin(true);
                                    setError(null);
                                }
                            }}
                        />
                    </RequestCard>
                    <CardShadow />
                </Wrapper>
                {activeStep === 4 && (
                    <Wrapper>
                        <BodySmall
                            style={{ textAlign: 'center', marginTop: '12px' }}
                            className="terms_link"
                        >
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

export const RequestSection = styled.section`
    margin-bottom: 15px;
    margin-top: 15px;
    width: 100%;
    > ${BodySmall} {
        margin-top: 6px;
    }
    ${InputRow} {
        margin-right: -10px;
    }
    ${LabelHalf} {
        margin-bottom: 0;
        margin-right: 10px;
        min-width: calc(50% - 10px);
        width: calc(50% - 10px);
    }
`;

export default addTranslate(MainForm, content);
