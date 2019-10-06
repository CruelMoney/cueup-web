import React, { useState } from 'react';
import moment from 'moment-timezone';
import { useCheckDjAvailability } from 'actions/EventActions';
import addTranslate from 'components/higher-order/addTranslate';
import { BodySmall } from 'components/Text';
import { Row, SmartButton } from '../../Blocks';
import { Input, useForm } from '../../FormComponents';
import LocationSelector from '../LocationSelectorSimple';
import DatePicker from '../Datepicker';
import ErrorMessageApollo from '../ErrorMessageApollo';

const Step1 = ({
    translate,
    form,
    next,
    handleChange,
    registerValidation,
    unregisterValidation,
    runValidations,
}) => {
    const [showDatePickter, setShowDatePickter] = useState(false);
    const [message, setMessage] = useState();

    const [check, { loading, error }] = useCheckDjAvailability(form);

    const dateChanged = (date) => {
        handleChange({ date });
        setShowDatePickter(false);
    };

    const submit = async (e) => {
        e.preventDefault();
        const errors = runValidations();

        if (errors.length === 0) {
            const { result, timeZoneId } = await check({ ...form, date: form.date.toDate() });
            if (result === true) {
                const newMoment = moment.tz(
                    form.date.format('YYYY-MM-DDTHH:mm:ss'),
                    'YYYY-MM-DDTHH:mm:ss',
                    timeZoneId
                );

                next({
                    ...form,
                    date: newMoment,
                    timezone: timeZoneId,
                });

                //not available
            } else {
                setMessage(translate('request-form.no-djs-message'));
            }
        }
    };

    const eventDateString = form.date.format('dddd Do, MMMM YYYY');
    return (
        <form name="requestForm-step-1" onSubmit={submit}>
            <h3 className="center">{translate('request-form.step-1.header')}</h3>

            {showDatePickter ? (
                <DatePicker dark initialDate={form.date} handleChange={dateChanged} />
            ) : (
                <div>
                    <section style={{ position: 'relative', zIndex: 5 }}>
                        <LocationSelector
                            noShadow
                            forceHeight
                            name="location"
                            label={translate('request-form.step-1.event-location')}
                            placeholder={translate('city')}
                            onSave={(location) => handleChange({ location })}
                            validation={(v) => (v ? null : 'Please select a location')}
                            registerValidation={registerValidation('location')}
                            unregisterValidation={unregisterValidation('location')}
                            defaultValue={form.location}
                        />
                        <BodySmall>
                            {translate('request-form.step-1.event-location-description')}
                        </BodySmall>
                    </section>
                    <section
                        className="cursor-pointer"
                        onClick={() => {
                            setShowDatePickter(true);
                        }}
                    >
                        <Input
                            type="text"
                            name="date"
                            label={translate('request-form.step-1.event-date')}
                            disabled
                            onClick={() => {
                                setShowDatePickter(true);
                            }}
                            value={eventDateString}
                            validation={(v) => (v ? null : 'Please select a date')}
                            registerValidation={registerValidation('date')}
                            unregisterValidation={unregisterValidation('date')}
                        />
                        <BodySmall>
                            {translate('request-form.step-1.event-date-description')}
                        </BodySmall>
                    </section>
                    <Row right>
                        {error && <ErrorMessageApollo error={error} />}
                        {message && (
                            <BodySmall style={{ marginTop: '5px' }} className={'center'}>
                                {message}
                            </BodySmall>
                        )}
                        <SmartButton type="submit" loading={loading}>
                            {translate('continue')}
                        </SmartButton>
                    </Row>
                </div>
            )}
        </form>
    );
};

export default addTranslate(Step1);
