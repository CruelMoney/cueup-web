import React, { useState } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import { Input, useForm, InputRow } from '../../../components/FormComponents';
import DatePickerPopup from '../../../components/DatePicker';
import CountrySelector from '../../../components/CountrySelector';
import ImageUploader from '../../../components/ImageInput';
import { VERIFY_STATUS, REQUEST_VERIFICATION } from '../gql';
import { LoadingPlaceholder2 } from '../../../components/common/LoadingPlaceholder';
import { Title, Body } from '../../../components/Text';
import { Row, TeritaryButton, SmartButton } from '../../../components/Blocks';
import ErrorMessageApollo from '../../../components/common/ErrorMessageApollo';

const statusText = {
    unverified:
        'Fill out the information to get verified. The provided information has to match the photo ID. Passport is preferred.',
    verified: 'You are verified.',
    pending: 'We are currently reviewing your documents.',
};

const VerifyIdentity = ({ initialData, status, details, onCancel }) => {
    const [mutate, { loading: submitting, error }] = useMutation(REQUEST_VERIFICATION);

    const [form, setForm] = useState(initialData);

    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const onChange = (key) => (val) => {
        setForm((form) => ({ ...form, [key]: val }));
    };

    const saveFullName = (value) => {
        const [firstName, ...lastName] = value.split(' ');
        onChange('fullName')(value);
        onChange('firstName')(firstName);
        onChange('lastName')(lastName.join(' '));
    };

    const save = (e) => {
        e.preventDefault();
        const refs = runValidations();
        if (refs[0] && refs[0].current) {
            return;
        }
        mutate({
            variables: {
                ...form,
            },
        });
    };

    const { fullName, birthday, address, city, countryCode, postalCode } = form;

    const inProcess = ['pending', 'verified'].includes(status);
    const formDisabled = inProcess || submitting;

    return (
        <form onSubmit={save}>
            <Title>Verify Identity</Title>
            <Body style={{ marginBottom: '30px' }}>{statusText[status]}</Body>
            <InputRow>
                <Input
                    half
                    label="Full name"
                    defaultValue={fullName}
                    placeholder="First Last"
                    type="text"
                    autoComplete="name"
                    name="name"
                    onSave={saveFullName}
                    disabled={formDisabled}
                    validation={(v) => {
                        if (!v) {
                            return 'Required';
                        }
                        const [firstName, ...lastName] = v.split(' ');
                        if (!firstName || !lastName.some((s) => !!s.trim())) {
                            return 'Please enter both first and last name';
                        }
                    }}
                    registerValidation={registerValidation('fullName')}
                    unregisterValidation={unregisterValidation('fullName')}
                />
                <DatePickerPopup
                    half
                    maxDate={new Date()}
                    minDate={false}
                    disabled={formDisabled}
                    label={'Birthday'}
                    onSave={(date) => onChange('birthday')(date)}
                    initialDate={birthday}
                    validation={(v) => (v ? null : 'Please select a birthday')}
                    registerValidation={registerValidation('birthday')}
                    unregisterValidation={unregisterValidation('birthday')}
                />
                {!inProcess && (
                    <ImageUploader
                        half
                        label="Photo ID front (jpg or png)"
                        buttonText={form.documentFront ? form.documentFront.name : 'select'}
                        disabled={formDisabled}
                        onSave={onChange('documentFront')}
                        validation={(v) => (v ? null : 'Required')}
                        registerValidation={registerValidation('documentFront')}
                        unregisterValidation={unregisterValidation('documentFront')}
                    />
                )}

                {!inProcess && (
                    <ImageUploader
                        half
                        label="Photo ID back (not needed for passport)"
                        buttonText={form.documentBack ? form.documentBack.name : 'select'}
                        disabled={formDisabled}
                        onSave={onChange('documentBack')}
                    />
                )}

                <Input
                    half
                    label="Address street"
                    placeholder="10 Downing Street"
                    type="text"
                    autoComplete="street-address"
                    name="street-address"
                    onSave={onChange('address')}
                    defaultValue={address}
                    disabled={formDisabled}
                    validation={(v) => (v ? null : 'Required')}
                    registerValidation={registerValidation('address')}
                    unregisterValidation={unregisterValidation('address')}
                />
                <Input
                    half
                    label="Postal code"
                    placeholder="SW1A 2AA"
                    type="text"
                    autoComplete="postal-code"
                    name="postal-code"
                    onSave={onChange('postalCode')}
                    disabled={formDisabled}
                    defaultValue={postalCode}
                    validation={(v) => (v ? null : 'Required')}
                    registerValidation={registerValidation('postalCode')}
                    unregisterValidation={unregisterValidation('postalCode')}
                />

                <Input
                    half
                    disabled={formDisabled}
                    defaultValue={city}
                    ini
                    label="City"
                    placeholder="London"
                    type="text"
                    autoComplete="locality"
                    name="locality"
                    onSave={onChange('city')}
                    validation={(v) => (v ? null : 'Required')}
                    registerValidation={registerValidation('city')}
                    unregisterValidation={unregisterValidation('city')}
                />
                <CountrySelector
                    half
                    disabled={formDisabled}
                    initialValue={countryCode}
                    onSave={onChange('countryCode')}
                    validation={(v) => (v ? null : 'Required')}
                    registerValidation={registerValidation('countryCode')}
                    unregisterValidation={unregisterValidation('countryCode')}
                />
            </InputRow>
            {!inProcess && (
                <Row right>
                    <TeritaryButton type="button" onClick={onCancel}>
                        Cancel
                    </TeritaryButton>
                    <SmartButton success={true} level="primary" loading={submitting} type="submit">
                        {submitting ? 'Submitting' : 'Submit'}
                    </SmartButton>
                </Row>
            )}
            <ErrorMessageApollo error={details || error} />
        </form>
    );
};

const Wrapper = (props) => {
    const { data = {}, loading } = useQuery(VERIFY_STATUS);
    const { me = {} } = data;
    const { userMetadata, appMetadata = { identityStatus: {} } } = me;
    const { details, status } = appMetadata.identityStatus || {};

    if (loading) {
        return <LoadingPlaceholder2 />;
    }

    const initialData = {
        ...me,
        ...userMetadata,
        fullName: `${userMetadata.firstName} ${userMetadata.lastName}`,
    };

    return (
        <VerifyIdentity
            {...props}
            initialData={initialData}
            status={status || 'unverified'}
            details={details}
        />
    );
};

export default Wrapper;
