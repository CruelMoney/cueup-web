import React, { useState } from 'react';
import moment from 'moment-timezone';
import { Mutation, useMutation } from 'react-apollo';
import { PrimaryButton } from 'components/Blocks';
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
                <div className="row center">
                    <div className="col-md-6">
                        <Progress setProgress={setProgress} currentStep={activeStep - 1} />
                        <div className="card">
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

                            {/* 
                                // <PrimaryButton name="request_djs_button" onClick={mutate} glow>
                                //     <div style={{ width: '150px' }}>{translate('get-offers')}</div>
                                // </PrimaryButton>

                                // <ErrorMessageApollo
                                //     center
                                //     error={error}
                                //     onFoundCode={(code) => {
                                //         if (code === 'UNAUTHENTICATED') {
                                //             showPopup(true);
                                //         }
                                //     }}
                                // />
                                // <p style={{ textAlign: 'center' }} className="terms_link">
                                //     {translate('terms-message')}
                                // </p> */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default addTranslate(MainForm, content);
