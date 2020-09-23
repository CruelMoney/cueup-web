import React, { useCallback, useRef } from 'react';
import styled from 'styled-components';
import { Route, Switch, useHistory, useLocation } from 'react-router';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { useForm } from 'components/hooks/useForm';
import DatePickerPopup from 'components/DatePickerPopup';
import { Input } from 'components/FormComponents';
import { CTAButton } from 'components/CTAButton';
import { useCheckDjAvailability } from 'actions/EventActions';
import LazyRequestForm from 'components/common/RequestForm';
import { StyledLabelComponent } from './Components';

const BookDJForm = ({ checkAvailability, activeLocation }) => {
    const routeLocation = useLocation();
    const history = useHistory();
    const locationRef = useRef();
    const dateRef = useRef();
    const { registerValidation, unregisterValidation, runValidations, form, setValue } = useForm();

    const { iso2 } = activeLocation;

    const [check, { loading, error }] = useCheckDjAvailability();

    const submit = useCallback(
        async (e) => {
            if (e) {
                e.preventDefault();
            }

            if (!form.locationName) {
                locationRef.current.focus();
                return;
            }
            if (!form.date) {
                dateRef.current.focus();
                return;
            }

            const errors = runValidations();
            if (errors.length === 0) {
                await LazyRequestForm.load();
                const { result, date, timeZoneId, location } = await check(form);

                if (result === true) {
                    const route = routeLocation.pathname + '/form';
                    history.push({
                        pathname: route,
                        state: {
                            activeStep: 2,
                            date,
                            timeZoneId,
                            location,
                        },
                    });
                }
            }
        },
        [check, form, history, routeLocation.pathname, runValidations]
    );

    return (
        <>
            <StyledLabelComponent>
                <LocationSelector
                    data-cy={'location-input'}
                    ref={locationRef}
                    name="query"
                    label={'LOCATION'}
                    placeholder={"Where's the event?"}
                    wrapperStyle={{
                        flex: 1,
                        height: '100%',
                        display: 'flex',
                        position: 'initial',
                        marginBottom: 0,
                    }}
                    countries={iso2 ? [iso2] : null}
                    onSave={(locationName) => setValue({ locationName })}
                    defaultValue={form.locationName}
                />
            </StyledLabelComponent>

            <StyledLabelComponent>
                <DatePickerPopup
                    showInside
                    data-cy={'date-input'}
                    ref={dateRef}
                    label="WHEN"
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    onSave={(date) => {
                        setValue({ date });
                    }}
                />
                <span className="divider" />
                <Input
                    label="GUESTS"
                    placeholder="Add guest count"
                    value={form.guests}
                    onChange={(guests) => {
                        setValue({ guests: guests.replace(/\D/g, '') });
                    }}
                />
            </StyledLabelComponent>

            <StyledLabelComponent>
                <Input
                    className={form.speakers ? '' : 'empty'}
                    label="SOUND SYSTEM"
                    type="button"
                    buttonText={form.speakers ? 'Yes' : 'Add sound system'}
                    onClick={() => setValue({ speakers: !form.speakers })}
                />
                <span className="divider" />
                <Input
                    className={form.lights ? '' : 'empty'}
                    label="LIGHTS"
                    type="button"
                    buttonText={form.lights ? 'Yes' : 'Add lights'}
                    onClick={() => setValue({ lights: !form.lights })}
                />
            </StyledLabelComponent>
            <CustomCTAButton noMargin noIcon type="submit" loading={loading} onClick={submit}>
                {checkAvailability ? 'Check availability' : 'Find DJs'}
            </CustomCTAButton>
        </>
    );
};

const CustomCTAButton = styled(CTAButton)`
    width: 100%;
    border-radius: 8px;
    margin: 0;
    height: 55px;
    margin-top: 6px;
    justify-content: center;
    padding: 0;
    font-size: 18px;
    font-weight: 600;
    letter-spacing: 0;
`;

export default BookDJForm;
