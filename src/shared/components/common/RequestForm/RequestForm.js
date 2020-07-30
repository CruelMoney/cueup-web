import React, { useState, useEffect, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { useHistory, useLocation } from 'react-router';
import { captureException } from '@sentry/core';
import { useQuery } from 'react-apollo';
import { Card, CardShadow, Col, Hr, LinkButton } from 'components/Blocks';
import { LabelHalf, InputRow, Label, InputLabel } from 'components/FormComponents';
import { BodySmall, TitleClean } from 'components/Text';
import { useCreateEvent } from 'actions/EventActions';
import { useForm } from 'components/hooks/useForm';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import { trackPageView } from 'utils/analytics';
import useDebounce from 'components/hooks/useDebounce';
import { ME } from 'components/gql';
import { appRoutes } from 'constants/locales/appRoutes';
import useUrlState from 'components/hooks/useUrlState';
import Login from '../Login';
import ErrorMessageApollo from '../ErrorMessageApollo';
import Progress from './ProgressSubmit';
import Step1 from './Step1';
import Step2 from './Step2';
import Step3 from './Step3';
import Step4 from './Step4';
import content from './content.json';

const MainForm = ({ initialCity, countries, transparent }) => {
    const { translate } = useNamespaceContent(content, 'requestForm');
    const history = useHistory();
    const routeLocation = useLocation();

    const { data: userData } = useQuery(ME);

    const [showLogin, setShowLogin] = useState(false);

    const [form, setForm] = useUrlState({
        activeStep: 1,
        locationName: initialCity,
        startMinute: 21 * 60,
        endMinute: 27 * 60,
        guestsCount: 100,
        contactName: userData?.me?.userMetadata.fullName,
        contactEmail: userData?.me?.email,
        contactPhone: userData?.me?.userMetadata.phone,
        ...routeLocation.state,
    });

    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const [error, setError] = useState();
    const [mutate, { loading }] = useCreateEvent(form);

    const { activeStep } = form;

    // track progress
    useEffect(() => {
        if (activeStep > 1) {
            trackPageView('/create-event-form-' + activeStep);
        }
    }, [activeStep]);

    const createEvent = async () => {
        const errors = runValidations();
        if (errors.length === 0) {
            const { error, data } = await mutate();
            if (data?.createEvent) {
                const { id, hash } = data?.createEvent;
                history.push(translate(appRoutes.event) + `/${id}/${hash}/overview`);
            }
            if (error) {
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
            setForm((f) => ({ ...f, activeStep: activeStep + 1 }));
        }
    };

    const back = () => {
        setForm((f) => ({ ...f, activeStep: activeStep - 1 }));
    };

    const setProgress = (step) => {
        if (step + 1 < activeStep) {
            setForm((f) => ({ ...f, activeStep: step }));
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
                                user={userData?.me}
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
                    {!transparent && <CardShadow />}
                </Wrapper>
                {activeStep === 4 && (
                    <BodySmall
                        style={{ textAlign: 'center', marginBottom: '12px', marginTop: '-12px' }}
                        className="terms_link"
                        dangerouslySetInnerHTML={{ __html: translate('terms-message-event') }}
                    />
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
    background: transparent;
    h3 {
        text-align: center;
        max-width: 380px;
        margin: 0 auto;
    }

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
    ${InputLabel} {
        margin-bottom: 0 !important;
    }
    ${Label} {
        margin-bottom: 0 !important;
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
