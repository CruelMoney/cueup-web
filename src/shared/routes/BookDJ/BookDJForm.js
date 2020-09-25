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
import { BodySmall } from 'components/Text';
import { loadScript } from 'components/hooks/useLazyLoadScript';
import { StyledLabelComponent } from './Components';

const BookDJForm = ({ checkAvailability, activeLocation }) => {
    const routeLocation = useLocation();
    const history = useHistory();
    const locationRef = useRef();
    const dateRef = useRef();
    const { runValidations, form, setValue } = useForm(null, {
        locationName: activeLocation.name,
    });

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
                await loadScript(
                    'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
                );
                await LazyRequestForm.load();

                const { result, date, timeZoneId, location } = await check(form);

                if (result === true) {
                    const route = routeLocation.pathname.replace(/\/$/, '') + '/form';

                    history.push({
                        pathname: route,
                        state: {
                            activeStep: 2,
                            date,
                            timeZoneId,
                            location,
                            speakers: !!form.speakers,
                            lights: !!form.lights,
                            guestsCount: form.guestsCount || 0,
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
                    value={form.guestsCount}
                    onChange={(guests) => {
                        setValue({ guestsCount: guests.replace(/\D/g, '') });
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
            <CustomCTAButton
                noMargin
                noIcon={!loading}
                type="submit"
                loading={loading}
                onClick={submit}
            >
                {checkAvailability ? 'Check availability' : 'Find DJs'}
            </CustomCTAButton>
            {error && (
                <BodySmall className="error" style={{ marginTop: 12 }}>
                    {error}
                </BodySmall>
            )}
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
