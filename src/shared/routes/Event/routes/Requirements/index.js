import React, { useState } from 'react';
import { useMutation } from 'react-apollo';
import emailValidator from 'email-validator';
import { useRouteMatch } from 'react-router';
import useTranslate from 'components/hooks/useTranslate';
import { REQUEST_EMAIL_VERIFICATION } from 'components/gql';
import { Col } from '../../../../components/Blocks';
import { SettingsSection, Input } from '../../../../components/FormComponents';

import SavingIndicator from '../../../../components/SavingIndicator';
import TextAreaPopup from '../../../../components/TextAreaPopup';
import { Body } from '../../../../components/Text';
import GenreSelector from '../../../../components/GenreSelector';
import PhoneInput from '../../../../components/common/PhoneInput';
import { UPDATE_EVENT } from '../../gql';

import { eventStates } from '../../../../constants/constants';

const required = (msg) => (val) => (!val ? msg : null);

const Requirements = React.forwardRef(({ theEvent, history }, ref) => {
    const { translate } = useTranslate();

    const match = useRouteMatch();

    const [update, { loading, error }] = useMutation(UPDATE_EVENT);

    if (!theEvent) {
        return null;
    }

    const {
        name,
        description,
        rider,
        genres,
        contactName,
        contactPhone,
        address,
        organizer,
    } = theEvent;

    const save = (key, optimistic) => async (val) => {
        if (theEvent[key] !== val) {
            await update({
                variables: {
                    id: theEvent.id,
                    hash: theEvent.hash,
                    [key]: val,
                },
            });
        }
    };

    const isCancable = ![eventStates.FINISHED, eventStates.CANCELLED].includes(theEvent.status);

    return (
        <Col ref={ref}>
            <SavingIndicator loading={loading} error={error} />

            <SettingsSection
                title={'Contact information'}
                description={
                    'Enter information on the person communicating with the DJ. This information is only visible to the DJ after the DJ has been booked.'
                }
            >
                <Input
                    label="Contact name"
                    defaultValue={contactName}
                    placeholder="Keep it short"
                    type="text"
                    autoComplete="name"
                    name="name"
                    onSave={save('contactName')}
                    validation={required('Name is needed')}
                />
                <Input
                    label="Contact email"
                    defaultValue={organizer?.email}
                    placeholder="mail@email.com"
                    error={
                        !organizer?.appMetadata?.emailVerified ? (
                            <VerifyEmailError email={organizer?.email} />
                        ) : null
                    }
                    type="email"
                    autoComplete="email"
                    name="email"
                    onSave={(email) => save('contactEmail')(email.trim())}
                    validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                />
                <PhoneInput
                    label="Phone"
                    attention={!contactPhone}
                    defaultValue={contactPhone}
                    placeholder="+123456789"
                    type="tel"
                    autoComplete="tel"
                    name="phone"
                    onSave={(phone) => save('contactPhone')(phone.trim())}
                />
            </SettingsSection>

            <SettingsSection
                title={'Requirements'}
                description={
                    'Add requirements to help us find the most qualified DJs for your event. '
                }
            >
                <Input
                    label="Name"
                    defaultValue={name}
                    placeholder="Keep it short"
                    type="text"
                    onSave={save('name')}
                    validation={required('The event needs a name')}
                />
                <TextAreaPopup
                    label="Description"
                    initialValue={description}
                    placeholder="Description"
                    type="text"
                    save={save('description')}
                    validation={required('The event needs a description')}
                >
                    <Body>{translate('event-description-placeholder')}</Body>
                </TextAreaPopup>
                <GenreSelector half initialGenres={genres} save={save('genres')} />

                <Input
                    half
                    type="button"
                    label="Speakers"
                    onClick={() =>
                        save('speakers', {
                            rider: {
                                ...rider,
                                speakers: !rider.speakers,
                            },
                        })(!rider.speakers)
                    }
                    buttonText={rider.speakers ? 'Required' : 'Not required'}
                />
                <Input
                    half
                    type="button"
                    label="Lights"
                    onClick={() =>
                        save('lights', {
                            rider: {
                                ...rider,
                                lights: !rider.lights,
                            },
                        })(!rider.lights)
                    }
                    buttonText={rider.lights ? 'Required' : 'Not required'}
                />
                <Input
                    label="Event address"
                    defaultValue={address}
                    placeholder="10 Downing Street"
                    type="text"
                    onSave={save('address')}
                    attention={!address}
                />
            </SettingsSection>

            <SettingsSection
                id="system"
                title={'System'}
                description={
                    "Cancelling the event will give you a refund as per the DJ's cancelation policy."
                }
            >
                {isCancable && (
                    <Input
                        half
                        type="button"
                        label="Cancel event"
                        warning={true}
                        onClick={() => history.push(match.url + '/cancel')}
                        buttonText="cancel"
                    />
                )}
                <Input
                    half
                    type="button"
                    label="Export all data"
                    buttonText="export"
                    onClick={(_) => {
                        window.alert("We'll send you an email when your data is ready.");
                    }}
                />
            </SettingsSection>
        </Col>
    );
});

const VerifyEmailError = ({ email }) => {
    const [request, { data, loading }] = useMutation(REQUEST_EMAIL_VERIFICATION);

    const handleClick = () => {
        request({
            variables: {
                email,
                redirectLink: window.location.href,
            },
        });
    };

    return (
        <>
            Email not verified -{' '}
            {data ? (
                <button disabled>email sent, remember to check spam</button>
            ) : loading ? (
                <button disabled>...</button>
            ) : (
                <button onClick={handleClick}>Resend link</button>
            )}
        </>
    );
};

export default Requirements;
