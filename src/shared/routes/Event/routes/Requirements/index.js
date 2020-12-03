import React, { useState } from 'react';
import { useMutation } from '@apollo/client';
import emailValidator from 'email-validator';
import { useRouteMatch } from 'react-router';
import moment from 'moment';
import useTranslate from 'components/hooks/useTranslate';
import { REQUEST_EMAIL_VERIFICATION } from 'components/gql';
import DatePickerPopup from 'components/DatePickerPopup';
import TimeSlider from 'components/common/TimeSlider/TimeSlider';
import { getTimezonedDate } from 'actions/EventActions';
import { Col, Hr } from '../../../../components/Blocks';
import { SettingsSection, Input, Label } from '../../../../components/FormComponents';

import SavingIndicator from '../../../../components/SavingIndicator';
import TextAreaPopup from '../../../../components/TextAreaPopup';
import { Body, PageTitle } from '../../../../components/Text';
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

    const save = async (data) => {
        await update({
            variables: {
                id: theEvent.id,
                hash: theEvent.hash,
                ...data,
            },
        });
    };

    const isCancable = ![eventStates.FINISHED, eventStates.CANCELLED].includes(theEvent.status);

    const initialStartDate = moment.tz(theEvent.start?.localDate, theEvent.timeZone);
    const initialStartMinute = initialStartDate.hour() * 60 + initialStartDate.minute();
    const initialEndMinute =
        moment(theEvent.end?.localDate).diff(initialStartDate, 'minutes') + initialStartMinute;

    const updateDateTime = async ({
        date = initialStartDate,
        startMinute = initialStartMinute,
        endMinute = initialEndMinute,
    }) => {
        const timezoneDate = await getTimezonedDate(date, theEvent.timeZone);

        save({
            date: timezoneDate,
            startMinute,
            endMinute,
        });
    };

    return (
        <Col ref={ref}>
            <PageTitle hideMobile>Event details</PageTitle>
            <Hr style={{ marginBottom: 30 }} />
            <SavingIndicator loading={loading} error={error} />

            <SettingsSection
                sticky={false}
                title={'Contact information'}
                description={'Enter information on the person communicating with the DJ.'}
            >
                <Input
                    v2
                    label="Contact name"
                    defaultValue={contactName}
                    type="text"
                    autoComplete="name"
                    name="name"
                    onSave={(contactName) => save({ contactName })}
                    validation={required('Name is needed')}
                />
                <Input
                    v2
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
                    onSave={(email) => save({ contactEmail: email.trim() })}
                    validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
                />
                <PhoneInput
                    v2
                    label="Phone"
                    attention={!contactPhone}
                    defaultValue={contactPhone}
                    placeholder="+123456789"
                    type="tel"
                    autoComplete="tel"
                    name="phone"
                    onSave={(phone) => save({ contactPhone: phone.trim() })}
                />
            </SettingsSection>

            <SettingsSection
                sticky={false}
                title={'Requirements'}
                description={
                    'Add requirements to help us find the most qualified DJs for your event. '
                }
            >
                <Input
                    half
                    v2
                    label="Name"
                    defaultValue={name}
                    type="text"
                    onSave={(name) => save({ name })}
                    validation={required('The event needs a name')}
                />
                <DatePickerPopup
                    half
                    v2
                    style={{ marginRight: 0 }}
                    label={'Date'}
                    minDate={new Date()}
                    initialDate={initialStartDate}
                    showMonthDropdown={false}
                    showYearDropdown={false}
                    maxDate={false}
                    onSave={(date) => {
                        updateDateTime({ date });
                    }}
                    // onSave={(name) => save({ name })}

                    validation={required('Please select a date')}
                />
                <Label
                    v2
                    style={{
                        minWidth: '100%',
                        paddingRight: '36px',
                        marginBottom: '30px',
                    }}
                >
                    <span
                        style={{
                            marginBottom: '12px',
                            display: 'block',
                            marginLeft: 9,
                        }}
                    >
                        Duration
                    </span>
                    <TimeSlider
                        v2
                        color={'#50e3c2'}
                        hoursLabel={translate('hours')}
                        startLabel={translate('start')}
                        endLabel={translate('end')}
                        initialValues={[initialStartMinute, initialEndMinute]}
                        onChange={([startMinute, endMinute]) => {
                            updateDateTime({
                                startMinute,
                                endMinute,
                            });
                        }}
                    />
                </Label>
                <TextAreaPopup
                    v2
                    label="Description"
                    initialValue={description}
                    placeholder="Description"
                    type="text"
                    save={(description) => save({ description })}
                    validation={required('The event needs a description')}
                >
                    <Body>{translate('event-description-placeholder')}</Body>
                </TextAreaPopup>
                <GenreSelector v2 half initialGenres={genres} save={(genres) => save({ genres })} />

                <Input
                    v2
                    half
                    type="button"
                    label="Speakers"
                    onClick={() => {
                        save({
                            speakers: !rider?.speakers,
                        });
                    }}
                    buttonText={rider?.speakers ? 'Required' : 'Not required'}
                />
                <Input
                    v2
                    half
                    type="button"
                    label="Lights"
                    onClick={() =>
                        save({
                            lights: !rider?.lights,
                        })
                    }
                    buttonText={rider?.lights ? 'Required' : 'Not required'}
                />
                <Input
                    v2
                    label="Event address"
                    defaultValue={address}
                    placeholder="10 Downing Street"
                    type="text"
                    onSave={(address) => save({ address })}
                    attention={!address}
                />
            </SettingsSection>

            <SettingsSection
                sticky={false}
                id="system"
                title={'System'}
                description={
                    "Cancelling the event will give you a refund as per the DJ's cancelation policy."
                }
            >
                {isCancable && (
                    <Input
                        half
                        v2
                        type="button"
                        label="Cancel event"
                        warning={true}
                        onClick={() => history.push(match.url + '/cancel')}
                        buttonText="cancel"
                    />
                )}
                <Input
                    half
                    v2
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
