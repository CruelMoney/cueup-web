import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';
import { captureException } from '@sentry/core';
import { Card, CardShadow, Col, Hr, LinkButton } from 'components/Blocks';
import { LabelHalf, InputRow } from 'components/FormComponents';
import { BodySmall, TitleClean } from 'components/Text';
import { useCreateEvent } from 'actions/EventActions';
import { useForm } from 'components/hooks/useForm';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { trackPageView } from 'utils/analytics';
import useDebounce from 'components/hooks/useDebounce';
import Login from '../Login';
import ErrorMessageApollo from '../ErrorMessageApollo';
import usePushNotifications from '../../hooks/usePushNotifications';
import Progress from './ProgressSubmit';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import Step5 from './Step5';
import content from './content.json';

const formToParams = (form) => {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        Object.keys(form).forEach((key) => {
            searchParams.set(key, JSON.stringify(form[key]));
        });
        return searchParams;
    } catch (error) {
        return '';
    }
};

const paramsToForm = (params, initialCity) => {
    const form = {
        date: new Date(),
        locationName: initialCity,
        startMinute: 21 * 60,
        endMinute: 27 * 60,
        guestsCount: 100,
    };

    try {
        const searchParams = new URLSearchParams(params);

        searchParams.forEach((val, key) => {
            const value = JSON.parse(val);
            if (key === 'date') {
                form[key] = new Date(value);
            } else {
                form[key] = value;
            }
        });
    } catch (error) {
        captureException(error);
    }
    return form;
};

const MainForm = ({ initialCity, countries }) => {
    const { translate } = useNamespaceContent(content, 'requestForm');
    const history = useHistory();
    const location = useLocation();

    const initialUrlState = useRef();

    if (!initialUrlState.current) {
        initialUrlState.current = paramsToForm(location.search, initialCity);
    }

    const [activeStep, setActiveStep] = useState(initialUrlState.current.activeStep || 1);
    const [showLogin, setShowLogin] = useState(false);
    const { pushShouldBeEnabled } = usePushNotifications();

    // defaults
    const [form, setForm] = useState(initialUrlState.current);
    const debouncedForm = useDebounce(form, 500);

    const { registerValidation, unregisterValidation, runValidations } = useForm(form);
    const [error, setError] = useState();
    const [mutate, { loading, data: createdEventData }] = useCreateEvent(form);

    // track progress
    useEffect(() => {
        if (activeStep > 1) {
            trackPageView('/create-event-form-' + activeStep);
        }
    }, [activeStep]);

    // save state to url
    useEffect(() => {
        if (activeStep > 1) {
            const searchParams = formToParams(debouncedForm);
            searchParams.set('activeStep', activeStep);

            history.push(`?${searchParams.toString()}`);
        }
    }, [debouncedForm, history, activeStep]);

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
        <div className="request-form" id="book-dj">
            <div className="request-columns">
                <Wrapper style={{ padding: 0 }}>
                    <Progress setProgress={setProgress} currentStep={activeStep - 1} />
                </Wrapper>
                <Wrapper>
                    <RequestCard>
                        {showLogin && (
                            <>
                                <TitleClean center>Login</TitleClean>
                                <BodySmall>{translate('email-exists-message')}</BodySmall>
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
                                translate={translate}
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
                                translate={translate}
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
                                translate={translate}
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
                                translate={translate}
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
                                translate={translate}
                                form={form}
                                handleChange={handleChange}
                                runValidations={runValidations}
                                registerValidation={registerValidation}
                                unregisterValidation={unregisterValidation}
                                next={next}
                                back={back}
                                pushShouldBeEnabled={pushShouldBeEnabled}
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
                            dangerouslySetInnerHTML={{ __html: translate('terms-message-event') }}
                        />
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

// eslint-disable-next-line import/no-unused-modules
export default MainForm;
