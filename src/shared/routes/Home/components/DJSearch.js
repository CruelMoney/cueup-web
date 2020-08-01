import React, { useRef, useState, useCallback } from 'react';

import styled from 'styled-components';
import SuperEllipse from 'react-superellipse';
import { useHistory, useLocation } from 'react-router';

import { SmartButton } from 'components/Blocks';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import { useForm } from 'components/hooks/useForm';
import { useCheckDjAvailability } from 'actions/EventActions';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import DatePicker from 'components/common/DatePicker';
import LazyRequestForm from 'components/common/RequestForm';

const DjSearch = () => {
    const routeLocation = useLocation();
    const history = useHistory();
    const locationRef = useRef();
    const dateRef = useRef();
    const [runSubmit, setRunSubmit] = useState(false);

    const [loadGoogleMaps, { started }] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    const { registerValidation, unregisterValidation, runValidations, form, setValue } = useForm();

    const [check, { loading, error }] = useCheckDjAvailability();

    const submit = useCallback(
        async (e) => {
            if (e) {
                e.preventDefault();
            }
            setRunSubmit(false);

            if (!form.locationName) {
                locationRef.current.focus();
                return;
            }

            if (!form.date) {
                setRunSubmit(true);
                dateRef.current.focus();
                return;
            }

            const errors = runValidations();
            if (errors.length === 0) {
                await LazyRequestForm.load();
                const { result, date, timeZoneId, location } = await check(form);

                if (result === true) {
                    const route = routeLocation.pathname + 'book-dj';
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
            <StyledSearchWrapper
                onMouseOver={() => {
                    DatePicker.preload();

                    if (!started) {
                        loadGoogleMaps();
                    }
                }}
            >
                <SearchWrapperBg />

                <LocationSelector
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
                    onSave={(locationName) => setValue({ locationName })}
                    validation={(v) => (v ? null : 'Please select a location')}
                    registerValidation={registerValidation('locationName')}
                    unregisterValidation={unregisterValidation('locationName')}
                    defaultValue={form.locationName}
                />

                <Divider />

                <DatePickerPopup
                    ref={dateRef}
                    label="WHEN"
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    validation={(v) => (v ? null : 'Please select a date')}
                    onSave={(date) => {
                        setValue({ date });
                        if (runSubmit) {
                            submit();
                        }
                    }}
                    registerValidation={registerValidation('date')}
                    unregisterValidation={unregisterValidation('date')}
                />

                <FindDjsButton>
                    <SmartButton
                        primary
                        loading={loading}
                        style={{ fontSize: '0.14em', height: '3em', minWidth: '6em' }}
                        onClick={submit}
                    >
                        Find DJs
                    </SmartButton>
                </FindDjsButton>
            </StyledSearchWrapper>
            <ErrorMessageApollo style={{ marginTop: '0.1em' }} error={error} />
        </>
    );
};

const Divider = styled.div`
    height: 60%;
    width: 2px;
    background: #d8d8d8;
`;
const StyledSearchWrapper = styled.div`
    position: relative;
    width: 100%;
    height: 0.6em;
    margin-top: 0.3em;
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: #fff;
    border-radius: 20px;

    label,
    ${Label} {
        flex: 1;
        color: #32325d;
        font-size: 0.1em;
        padding-left: 1.7em;
        height: 100%;
        font-weight: 600;
        letter-spacing: 0.08em;
        padding-top: 1.25em;
        margin-bottom: 0;
        min-width: 0;
        max-width: 90%;
        > input,
        > button {
            font-size: 1.5em;
            display: block;
            border: none;
            outline: none;
            background: transparent;
            text-indent: 0px;
            padding-left: 0px;
            margin-top: 0;
            margin-left: -1px;
            height: 1.4em;
            line-height: 1.4em !important;
            width: auto;
        }
        .empty {
            color: #98a4b3;
        }
    }

    ul {
        top: 0;
        left: 0;
        right: 0;
        padding-top: 4em;
        border-radius: 1.4em;
    }
    .powered-by-google {
        top: 1.5em !important;
        display: flex;
        right: 1em !important;
    }
    .error {
        display: none;
    }

    @media screen and (max-width: 480px) {
        ${Divider},
        > label {
            display: none;
        }
    }
`;

const SearchWrapperBg = styled(SuperEllipse)`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: -1;
`;

const FindDjsButton = styled(SuperEllipse)`
    position: absolute;
    right: 0.1em;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    background-color: #31daff;
`;

export default DjSearch;
