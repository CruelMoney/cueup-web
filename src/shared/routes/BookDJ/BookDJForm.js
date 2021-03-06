import React, { useCallback, useRef } from 'react';
import { useHistory, useLocation } from 'react-router';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { useForm } from 'components/hooks/useForm';
import DatePickerPopup from 'components/DatePickerPopup';
import { Input } from 'components/FormComponents';
import { useCheckDjAvailability } from 'actions/EventActions';
import LazyRequestForm from 'components/common/RequestForm';
import { BodySmall } from 'components/Text';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import useTranslate from 'components/hooks/useTranslate';
import { appRoutes } from 'constants/locales/appRoutes';
import { CustomCTAButton, StyledLabelComponent } from './Components';

const BookDJForm = ({ checkAvailability, activeLocation }) => {
    const { translate } = useTranslate();
    const routeLocation = useLocation();
    const history = useHistory();
    const locationRef = useRef();
    const dateRef = useRef();
    const { runValidations, form, setValue } = useForm(null, {
        locationName: activeLocation.name,
    });

    const { iso2 } = activeLocation;

    const [check, { loading, error }] = useCheckDjAvailability();

    const [startLoadingScript] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    const submit = useCallback(
        async (e) => {
            if (e) {
                e.preventDefault();
            }

            if (!form.locationName) {
                locationRef.current.focus();
                return;
            }

            const errors = runValidations();
            if (errors.length === 0) {
                await LazyRequestForm.load();

                const { result, date, timeZone, location, error } = await check(form);

                if (error) {
                    return;
                }
                if (result === true) {
                    history.push({
                        pathname: translate(appRoutes.search),
                        state: {
                            ...form,
                            equipment: {
                                lights: form.lights,
                                speakers: form.speakers,
                            },
                            date: form.date,
                            timeZone,
                            location,
                        },
                    });
                } else {
                    const route = routeLocation.pathname.replace(/\/$/, '') + '/form';

                    history.push({
                        pathname: route,
                        state: {
                            activeStep: 2,
                            date,
                            timeZone,
                            location,
                            speakers: !!form.speakers,
                            lights: !!form.lights,
                            guestsCount: form.guestsCount || 0,
                        },
                    });
                }
            }
        },
        [check, form, history, routeLocation.pathname, runValidations, translate]
    );

    return (
        <div onMouseEnter={startLoadingScript}>
            <StyledLabelComponent>
                <LocationSelector
                    v2
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
                    v2
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
                    v2
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
                    v2
                    className={form.speakers ? '' : 'empty'}
                    label="SOUND SYSTEM"
                    type="button"
                    buttonText={form.speakers ? 'Yes' : 'Add sound system'}
                    onClick={() => setValue({ speakers: !form.speakers })}
                />
                <span className="divider" />
                <Input
                    v2
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
        </div>
    );
};

export default BookDJForm;
