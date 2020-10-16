import React, { useState } from 'react';

import { InlineIcon } from '@iconify/react';
import speechIcon from '@iconify/icons-ion/ios-text';

import { useQuery } from '@apollo/client';
import { useLocation } from 'react-router';
import { PrimaryButton, Row, RowWrap, SmartButton, TeritaryButton } from 'components/Blocks';
import { Body, BodyBold, BodySmall } from 'components/Text';

import Step4 from 'components/common/RequestForm/Step4';
import { useForm } from 'components/hooks/useForm';
import { ME } from 'components/gql';
import useUrlState from 'components/hooks/useUrlState';
import { useCreateEvent } from 'actions/EventActions';
import { Input } from 'components/FormComponents';
import useTranslate from 'components/hooks/useTranslate';
import useNamespaceContent from 'components/hooks/useNamespaceContent';
import content from 'components/common/RequestForm/content.json';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import { GreyBox } from './Components';

export const RequestOffers = ({
    form,
    setValue,
    registerValidation,
    unregisterValidation,
    runValidations,
}) => {
    const { data: userData } = useQuery(ME);

    const [mutate, { loading, data, error }] = useCreateEvent(form);

    const hasSubmittet = !!data?.createEvent?.id;

    const handleChange = (data) => {
        setValue(data);
    };

    const next = (step) => {
        const errors = runValidations();
        if (!errors.length) {
            setValue({ requestStep: step });
        }
    };

    const handleSubmit = () => {
        const errors = runValidations();
        if (!errors.length) {
            mutate();
        }
    };
    if (hasSubmittet) {
        return (
            <GreyBox>
                <h3>Thank you!</h3>
                <Body style={{ marginTop: 12 }}>We've sent a confirmation on email.</Body>
            </GreyBox>
        );
    }

    return (
        <GreyBox>
            {form.requestStep === 1 && (
                <Step3
                    form={form}
                    handleChange={handleChange}
                    runValidations={runValidations}
                    registerValidation={registerValidation}
                    unregisterValidation={unregisterValidation}
                    next={() => next(2)}
                    back={() => setValue({ requestStep: false })}
                />
            )}
            {form.requestStep === 2 && (
                <Step4
                    hideHeadline
                    form={form}
                    handleChange={handleChange}
                    runValidations={runValidations}
                    registerValidation={registerValidation}
                    unregisterValidation={unregisterValidation}
                    next={handleSubmit}
                    back={() => setValue({ requestStep: 1 })}
                    loading={loading}
                    user={userData?.me}
                    style={{
                        width: 'auto',
                    }}
                    buttonLabel="Get quotes"
                />
            )}

            {!form.requestStep && (
                <>
                    <BodyBold>
                        <InlineIcon
                            icon={speechIcon}
                            color="#25F4D2"
                            width={'1.5em'}
                            height={'1.5em'}
                            style={{ marginRight: 9, marginBottom: -6 }}
                        />
                        Tired of searching?
                    </BodyBold>
                    <BodySmall style={{ marginBottom: 15 }}>
                        Get tailored prices directly from the DJs. We’ll find the most suitable DJs
                        and inquire them to send their best offers for your event.
                    </BodySmall>
                    <SmartButton
                        onClick={() => next(1)}
                        level="secondary"
                        fullWidth
                        style={{
                            height: '50px',
                            backgroundColor: '#fff',
                            borderRadius: 13,
                            border: '0.5px solid rgba(77, 100, 128, 0.2)',
                        }}
                    >
                        Get quotes - let us find the DJs
                    </SmartButton>
                </>
            )}
            <ErrorMessageApollo error={error} />
        </GreyBox>
    );
};

const Step3 = ({ form, registerValidation, unregisterValidation, handleChange, next, back }) => {
    const { translate } = useNamespaceContent(content, 'requestForm');

    return (
        <>
            <Input
                v2
                autoFocus
                name="eventName"
                label={translate('requestForm:step-2.event-name')}
                onSave={(name) => handleChange({ name })}
                validation={(v) => (v ? null : 'Please write a name')}
                registerValidation={registerValidation('name')}
                unregisterValidation={unregisterValidation('name')}
                defaultValue={form.name}
                placeholder="Anniversary party etc."
            />
            <Input
                v2
                type="text-area"
                style={{
                    height: '120px',
                }}
                defaultValue={form.description}
                label={translate('requestForm:step-3.event-description')}
                placeholder={translate('event-description-placeholder')}
                name="description"
                onSave={(description) => handleChange({ description })}
                validation={(v) => (v ? null : 'Please write a description')}
                registerValidation={registerValidation('description')}
                unregisterValidation={unregisterValidation('description')}
            />
            <Row right>
                <TeritaryButton type="button" onClick={back}>
                    {translate('back')}
                </TeritaryButton>
                <PrimaryButton data-cy="next-button" type="submit" onClick={next}>
                    {'Next'}
                </PrimaryButton>
            </Row>
        </>
    );
};
