import React, { useRef, useState, useCallback, useEffect } from 'react';
import SuperEllipse from 'react-superellipse';

import styled, { css } from 'styled-components';
import { useHistory, useLocation } from 'react-router';

import { Icon } from '@iconify/react';
import searchIcon from '@iconify/icons-ion/search';
import { LoadingIndicator, SmartButton } from 'components/Blocks';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import { useForm } from 'components/hooks/useForm';
import { useCheckDjAvailability } from 'actions/EventActions';
import ErrorMessageApollo from 'components/common/ErrorMessageApollo';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';
import DatePicker from 'components/common/DatePicker';
import LazyRequestForm from 'components/common/RequestForm';
import { appRoutes } from 'constants/locales/appRoutes';
import useTranslate from 'components/hooks/useTranslate';

const DjSearch = ({ initialLocation, small }) => {
    const { translate } = useTranslate();
    const history = useHistory();
    const locationRef = useRef();
    const dateRef = useRef();
    const [runSubmit, setRunSubmit] = useState(false);

    const [loadGoogleMaps, { started }] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    const { registerValidation, unregisterValidation, runValidations, form, setValue } = useForm(
        null,
        {
            locationName: initialLocation,
        }
    );

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
                            activeStep: 2,
                            date: form.date,
                            timeZone,
                            location,
                        },
                    });
                } else {
                    const route = '/book-dj';
                    history.push({
                        pathname: route,
                        state: {
                            activeStep: 2,
                            date,
                            timeZone,
                            location,
                        },
                    });
                }
            }
        },
        [check, form, history, runValidations, translate]
    );

    useEffect(() => {
        if (runSubmit) {
            submit();
        }
    }, [runSubmit, submit]);

    if (small) {
        return (
            <SmallSearch
                locationRef={locationRef}
                setValue={setValue}
                form={form}
                loading={loading}
                submit={submit}
                registerValidation={registerValidation}
                unregisterValidation={unregisterValidation}
            />
        );
    }

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
                    onSave={(locationName) => setValue({ locationName })}
                    validation={(v) => (v ? null : 'Please select a location')}
                    registerValidation={registerValidation('locationName')}
                    unregisterValidation={unregisterValidation('locationName')}
                    defaultValue={form.locationName}
                />

                <Divider />

                <DatePickerPopup
                    data-cy={'date-input'}
                    ref={dateRef}
                    label="WHEN"
                    maxDate={new Date().setFullYear(new Date().getFullYear() + 5)}
                    buttonText="Add date"
                    validation={(v) => (v ? null : 'Please select a date')}
                    onSave={(date) => {
                        setValue({ date });
                    }}
                />

                <FindDjsButton>
                    <SmartButton
                        primary
                        type="submit"
                        loading={loading}
                        style={{ fontSize: '0.14em', height: '3em', minWidth: '6em' }}
                        onClick={submit}
                    >
                        Find DJs
                    </SmartButton>
                </FindDjsButton>
            </StyledSearchWrapper>
            <ErrorMessageApollo
                style={{ marginTop: '0.5em', fontSize: '0.15em', paddingLeft: '1em' }}
                error={error}
            />
        </>
    );
};

const SmallSearch = ({ locationRef, setValue, form, loading, submit }) => {
    const [focused, setFocused] = useState(false);

    useEffect(() => {
        if (form.locationName && !loading) {
            submit();
        }
    }, [form.locationName, submit, loading]);

    return (
        <StyledSearchWrapperSmall focused={focused}>
            <SearchWrapperBg />

            <LocationSelector
                data-cy={'location-input'}
                ref={locationRef}
                name="query"
                placeholder={'City, venue, etc...'}
                onFocus={() => setFocused(true)}
                onBlur={() => setFocused(false)}
                wrapperStyle={{
                    flex: 1,
                    height: '100%',
                    display: 'flex',
                    position: 'initial',
                    marginBottom: 0,
                }}
                onSave={(locationName) => {
                    setValue({ locationName });
                }}
                defaultValue={form.locationName}
            />
            {loading ? (
                <LoadingIndicator style={{ marginRight: 9 }} />
            ) : (
                <FindDjsButton>
                    <SmartButton
                        primary
                        type="submit"
                        disabled={loading}
                        style={{ minWidth: '0' }}
                        onClick={submit}
                    >
                        Find DJs
                    </SmartButton>
                </FindDjsButton>
            )}
        </StyledSearchWrapperSmall>
    );
};

const Divider = styled.div`
    height: 60%;
    width: 2px;
    background: #d8d8d8;
`;

const FallbackSuperllipsis = (props) => {
    // if (typeof window === 'undefined' || !window?.ResizeObserver) {
    //     return <div {...props} style={{ borderRadius: '10px', ...props.style }} />;
    // }
    return <SuperEllipse {...props} />;
};

const SearchWrapperBg = styled(FallbackSuperllipsis)`
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    background: #fff;
    z-index: -1;
`;

const FindDjsButton = styled(FallbackSuperllipsis)`
    position: absolute;
    right: 0.1em;
    top: 50%;
    transform: translateY(-50%);
    z-index: 1;
    background-color: #31daff;
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
        > span {
            margin-left: 0 !important;
        }
        > input,
        > button {
            font-size: 1.6em;
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

const StyledSearchWrapperSmall = styled(StyledSearchWrapper)`
    margin-top: 0;
    width: 250px;
    height: 40px;
    transition: ease 250ms;

    ${({ focused }) =>
        focused &&
        css`
            width: 350px;
        `}

    ${SearchWrapperBg} {
        border-radius: 20px;
    }
    label,
    ${Label} {
        padding-top: 0;
        input {
            height: 100%;
            font-size: 17px;
            padding-left: 14px;
        }
    }
    ${FindDjsButton} {
        height: calc(100% - 7px);
        margin-right: 2px;
        border-radius: 20px;
        button {
            height: 100%;
        }
    }

    ul {
        padding-top: 2em;
    }
    .powered-by-google {
        display: none;
    }
`;

export default DjSearch;
