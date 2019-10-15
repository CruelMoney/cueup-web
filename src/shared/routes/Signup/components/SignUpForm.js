import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import { localize } from 'react-localize-redux';
import { useMutation } from 'react-apollo';
import { SmartButton, Row } from 'components/Blocks';
import { Input } from 'components/FormComponents';
import { useForm } from 'components/hooks/useForm';
import RegistrationElement from 'components/common/RegistrationElement';
import LocationSelector from 'components/common/LocationSelectorSimple';
import ToggleButtonHandler from 'components/common/ToggleButtonHandler';
import NumberedList from '../../../components/common/NumberedList';
import c from '../../../constants/constants';
import GeoCoder from '../../../utils/GeoCoder';
import SimpleMap from '../../../components/common/Map';
import { CREATE_USER } from '../../../components/gql';

const SignupForm = ({ translate, geoCity, reference }) => {
    const [mutate, { loading, error }] = useMutation(CREATE_USER);

    const [state, setState] = useState({});
    const { registerValidation, unregisterValidation, runValidations } = useForm(state);

    const setValue = (slice) => setState((s) => ({ ...s, ...slice }));

    const signup = async (e) => {
        e.preventDefault();

        const errors = runValidations();

        if (!errors?.length) {
            let { name, playingLocation, playingRadius, location } = state;
            name = name.split(' ');
            const lastName = name.pop();
            const firstName = name.join(' ');
            const variables = {
                ...state,
                lastName,
                firstName,
                playingLocation: {
                    name: location,
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
        }
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
                    location: geoResult.position,
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
                    hideOn={['FACEBOOK', 'SIGNED_IN']}
                >
                    <Input
                        big
                        name="email"
                        validate={['required', 'email']}
                        placeholder="mail@gmail.com"
                    />
                </RegistrationElement>

                <RegistrationElement
                    name="password"
                    label="Password"
                    active={true}
                    text={translate('signup.form.password')}
                    hideOn={['FACEBOOK', 'SOUNDCLOUD', 'SIGNED_IN']}
                >
                    <Input
                        big
                        type="password"
                        name="password"
                        validate={['required', 'minLength']}
                        placeholder="Something super secret"
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
                        validate={['required', 'lastName']}
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
                        validate={['required']}
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
                        name="location"
                        onChange={updateMap}
                        validate={['required']}
                        value={geoCity !== '' ? geoCity : undefined}
                    />

                    {state.location ? (
                        <SimpleMap
                            key={state.locationName}
                            radius={25000}
                            name={'playingLocation'}
                            value={state.location}
                            editable={true}
                            radiusName="playingRadius"
                            locationName="playingLocation"
                        />
                    ) : null}
                </RegistrationElement>

                <RegistrationElement
                    name="genres"
                    label={translate('Genres')}
                    active={true}
                    text={translate('finish-signup.genres')}
                >
                    <ToggleButtonHandler
                        name="genres"
                        potentialValues={c.GENRES}
                        validate={['required']}
                        columns={4}
                    />
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
