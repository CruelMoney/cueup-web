import React, { useState, useCallback } from 'react';
import { useHistory } from 'react-router';
import { useCheckDjAvailability } from 'actions/EventActions';
import { BodySmall } from 'components/Text';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import { Row, SmartButton, TeritaryButton } from '../../Blocks';
import { Input } from '../../FormComponents';
import LocationSelector from '../LocationSelectorSimple';
import DatePicker from '../DatePicker';
import ErrorMessageApollo from '../ErrorMessageApollo';
import { RequestSection } from './RequestForm';

const Step1 = ({
    translate,
    form,
    next,
    handleChange,
    registerValidation,
    unregisterValidation,
    runValidations,
    countries,
}) => {
    const history = useHistory();
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [check, { loading, error }] = useCheckDjAvailability(form);

    const [loadGoogleMaps, { started }] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    const dateChanged = useCallback(
        (date) => {
            handleChange({ date });
            setShowDatePicker(false);
        },
        [handleChange]
    );

    const submit = async (e) => {
        e.preventDefault();
        const errors = runValidations();

        if (errors.length === 0) {
            const { date, timeZoneId, location, error } = await check(form);
            if (!error) {
                next({
                    ...form,
                    date,
                    timeZoneId,
                    location,
                });
            }
        }
    };

    // handle both moment and js date
    const eventDateString =
        typeof form.date?.format === 'function'
            ? form.date.format('dddd Do, MMMM YYYY')
            : typeof form.date?.toLocaleDateString === 'function'
            ? form.date?.toLocaleDateString()
            : null;

    return (
        <form name="requestForm-step-1" onSubmit={submit}>
            <h3 className="center">{translate('requestForm:step-1.header')}</h3>

            {showDatePicker ? (
                <DatePicker dark initialDate={form.date} handleChange={dateChanged} />
            ) : (
                <div
                    onMouseOver={() => {
                        DatePicker.preload();
                        if (!started) {
                            loadGoogleMaps();
                        }
                    }}
                >
                    <RequestSection style={{ position: 'relative', zIndex: 5 }}>
                        <LocationSelector
                            noShadow
                            v2
                            data-cy={'location-input'}
                            countries={countries}
                            forceHeight
                            name="query"
                            label={translate('requestForm:step-1.event-location')}
                            placeholder={translate('requestForm:step-1.event-location-placeholder')}
                            onSave={(locationName) => handleChange({ locationName })}
                            validation={(v) => (v ? null : 'Please select a location')}
                            registerValidation={registerValidation('locationName')}
                            unregisterValidation={unregisterValidation('locationName')}
                            defaultValue={form.locationName}
                        >
                            <BodySmall style={{ marginLeft: 9 }}>
                                {translate('requestForm:step-1.event-location-description')}
                            </BodySmall>
                        </LocationSelector>
                    </RequestSection>
                    <RequestSection
                        onClick={() => {
                            setShowDatePicker(true);
                        }}
                    >
                        <Input
                            v2
                            data-cy="date-input"
                            type="text"
                            name="date"
                            placeholder="Select date"
                            label={translate('requestForm:step-1.event-date')}
                            disabled
                            labelStyle={{
                                cursor: 'pointer',
                            }}
                            style={{
                                pointerEvents: 'none',
                                zIndex: 2,
                                position: 'relative',
                            }}
                            value={eventDateString}
                            validation={(v) => (v ? null : 'Please select a date')}
                            registerValidation={registerValidation('date')}
                            unregisterValidation={unregisterValidation('date')}
                        >
                            <BodySmall>
                                {translate('requestForm:step-1.event-date-description')}
                            </BodySmall>
                        </Input>
                    </RequestSection>
                    <Row right>
                        <TeritaryButton type="button" onClick={() => history.goBack()}>
                            {translate('back')}
                        </TeritaryButton>
                        <SmartButton type="submit" onClick={submit} loading={loading}>
                            {translate('continue')}
                        </SmartButton>
                    </Row>

                    {error && <ErrorMessageApollo error={error} />}
                </div>
            )}
        </form>
    );
};

export default Step1;
