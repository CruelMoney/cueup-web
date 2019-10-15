import React, { useState, useRef } from 'react';
import debounce from 'lodash/debounce';
import { localize } from 'react-localize-redux';
import { useMutation } from 'react-apollo';
import { SmartButton, Row } from 'components/Blocks';
import { Input } from 'components/FormComponents';
import { useForm, validators, useValidation } from 'components/hooks/useForm';
import RegistrationElement from 'components/common/RegistrationElement';
import LocationSelector from 'components/common/LocationSelectorSimple';
import ToggleButtonHandler from 'components/common/ToggleButtonHandler';
import ErrorMessage from 'components/common/ErrorMessage';
import NumberedList from '../../../components/common/NumberedList';
import c from '../../../constants/constants';
import GeoCoder from '../../../utils/GeoCoder';
import SimpleMap from '../../../components/common/Map';
import { CREATE_USER } from '../../../components/gql';
import ErrorMessageApollo from '../../../components/common/ErrorMessageApollo';

const SignupForm = ({ translate, geoCity, reference }) => {
    const [mutate, { loading, error }] = useMutation(CREATE_USER);
    const genreRef = useRef();
    const [state, setState] = useState({
        genres: [],
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(state);

    const { error: genreError, runValidation: runGenreValidation } = useValidation({
        ref: genreRef,
        validation: validators.required,
        registerValidation: registerValidation('genres'),
        unregisterValidation: unregisterValidation('genres'),
    });

    const setValue = (slice) => setState((s) => ({ ...s, ...slice }));

    const signup = async (e) => {
        e.preventDefault();

        const errors = runValidations(true);

        if (errors?.length) {
            return;
        }

        let { name, playingLocation, playingRadius, locationName } = state;
        name = name.split(' ');
        const lastName = name.pop();
        const firstName = name.join(' ');
        const variables = {
            ...state,
            lastName,
            firstName,
            playingLocation: {
                name: locationName,
                latitude: playingLocation.lat,
                longitude: playingLocation.lng,
                radius: playingRadius,
            },
            reference: reference,
            redirectLink: c.Environment.CALLBACK_DOMAIN,
        };
        await mutate({ variables });
        setValue({
            msg: "Thanks for joining. Please verify your email using the link we've just sent.",
        });
    };

    const updateMap = debounce((location) => {
        //Getting the coordinates of the playing location
        GeoCoder.codeAddress(location, (geoResult) => {
            if (geoResult.error) {
                setValue({
                    locationErr: translate('City not found'),
                    location: null,
                });
            } else {
                setValue({
                    locationName: location,
                    playingLocation: geoResult.position,
                });
            }
        });
    }, 500);

    return (
        <form name={'signup-form'} onSubmit={signup}>
            <NumberedList>
                <RegistrationElement
                    name="email"
                    label="Email"
                    active={true}
                    text={translate('signup.form.email')}
                >
                    <Input
                        big
                        name="email"
                        placeholder="mail@gmail.com"
                        onSave={(email) => setValue({ email })}
                        validation={[validators.required, validators.email]}
                        registerValidation={registerValidation('email')}
                        unregisterValidation={unregisterValidation('email')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="password"
                    label="Password"
                    active={true}
                    text={translate('signup.form.password')}
                >
                    <Input
                        big
                        type="password"
                        name="password"
                        placeholder="Something super secret"
                        onSave={(password) => setValue({ password })}
                        validation={[validators.required, validators.minLength(6)]}
                        registerValidation={registerValidation('password')}
                        unregisterValidation={unregisterValidation('password')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="name"
                    label={translate('Name')}
                    active={true}
                    text={translate('finish-signup.name')}
                >
                    <Input
                        big
                        name="name"
                        placeholder={translate('first-last')}
                        onSave={(name) => setValue({ name })}
                        validation={[validators.required, validators.lastName]}
                        registerValidation={registerValidation('name')}
                        unregisterValidation={unregisterValidation('name')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="phone"
                    label={translate('Phone number')}
                    active={true}
                    text={translate('finish-signup.phone')}
                >
                    <Input
                        big
                        name="phone"
                        type="tel"
                        placeholder="12345678"
                        onSave={(phone) => setValue({ phone })}
                        validation={[validators.required]}
                        registerValidation={registerValidation('phone')}
                        unregisterValidation={unregisterValidation('phone')}
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="location"
                    label={translate('Location')}
                    active={true}
                    text={translate('finish-signup.location')}
                >
                    <LocationSelector
                        big
                        autocomplete="off"
                        name="playingLocation"
                        onChange={updateMap}
                        validation={[validators.required]}
                        registerValidation={registerValidation('playingLocation')}
                        unregisterValidation={unregisterValidation('playingLocation')}
                    />

                    {state.playingLocation ? (
                        <SimpleMap
                            key={state.locationName}
                            radius={25000}
                            name={'playingLocation'}
                            value={state.playingLocation}
                            editable={true}
                            radiusName="playingRadius"
                            locationName="playingLocation"
                            onCoordinatesChange={(playingLocation) => setValue({ playingLocation })}
                            onRadiusChange={(playingRadius) => setValue({ playingRadius })}
                        />
                    ) : null}
                </RegistrationElement>

                <RegistrationElement
                    name="genres"
                    label={translate('Genres')}
                    active={true}
                    text={translate('finish-signup.genres')}
                    ref={genreRef}
                >
                    <ToggleButtonHandler
                        name="genres"
                        potentialValues={c.GENRES}
                        onChange={(genres) => {
                            setValue({ genres });
                            runGenreValidation(genres);
                        }}
                        columns={4}
                    />
                    <ErrorMessageApollo error={genreError} />
                </RegistrationElement>

                <RegistrationElement
                    name="picture"
                    label={translate('Picture')}
                    active={true}
                    text={translate('finish-signup.picture')}
                >
                    {/* <FileInput validate={['required']} name="picture" /> */}
                </RegistrationElement>

                <RegistrationElement
                    name="bio"
                    label={translate('About you')}
                    active={true}
                    text={translate('finish-signup.about')}
                >
                    <Input
                        type="text-area"
                        validate={['required']}
                        style={{ height: '150px' }}
                        name="bio"
                        onSave={(bio) => setValue({ bio })}
                        validation={[validators.required, validators.minLength(100)]}
                        registerValidation={registerValidation('bio')}
                        unregisterValidation={unregisterValidation('bio')}
                    />
                </RegistrationElement>
            </NumberedList>

            <Row center>
                <SmartButton glow type="submit" loading={loading} name="signup">
                    <div
                        style={{
                            width: '100px',
                        }}
                    >
                        {translate('Join')}
                    </div>
                </SmartButton>
            </Row>
            <ErrorMessageApollo error={error} />
            <div className="row">
                <div className="col-xs-12">
                    <p
                        style={{
                            textAlign: 'center',
                            marginTop: '10px',
                        }}
                        className="terms_link"
                    >
                        {translate('terms-message')}
                    </p>
                </div>
            </div>
            {state.msg ? (
                <div
                    style={{
                        textAlign: 'center',
                    }}
                >
                    <p
                        style={{
                            fontSize: '20px',
                        }}
                    >
                        {state.msg}
                    </p>
                </div>
            ) : null}
        </form>
    );
};

export default localize(SignupForm, 'locale');
