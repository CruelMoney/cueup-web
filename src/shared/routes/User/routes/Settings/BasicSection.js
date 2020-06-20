import React from 'react';
import emailValidator from 'email-validator';
import { useQuery } from 'react-apollo';

import { SettingsSection, Input } from 'components/FormComponents';
import ImageUploader from 'components/ImageInput';
import DatePickerPopup from 'components/DatePickerPopup';

import PhoneInput from 'components/common/PhoneInput';

import PasswordChanger from '../../components/PasswordChanger';

import { USER_EDITS } from '../../gql';

const BasicSection = ({ user, updateKey, saveData }) => {
    const { data } = useQuery(USER_EDITS);
    const editsMap = data?.me?.editsMap || {};

    const saveFullName = async (value) => {
        const [firstName, ...lastName] = value.split(' ');
        const data = {
            firstName,
            lastName: lastName.join(' '),
        };

        await saveData(data);
    };

    const { userMetadata, appMetadata, email } = user;
    const { firstName, lastName, phone, birthday } = userMetadata;
    const { identityVerified } = appMetadata;
    return (
        <SettingsSection
            id="basics"
            title={'Basics'}
            description={
                'Edit your basic information. We might require some of this information for verification purposes.'
            }
        >
            <Input
                label="Full name"
                defaultValue={`${firstName} ${lastName}`}
                disabled={identityVerified}
                placeholder="First Last"
                type="text"
                autoComplete="name"
                name="name"
                onSave={saveFullName}
                validation={(v) => {
                    const [firstName, ...lastName] = v.split(' ');
                    if (!firstName || !lastName.some((s) => !!s.trim())) {
                        return 'Please enter both first and last name';
                    }
                }}
            />
            <Input
                half
                label="Email"
                defaultValue={email}
                placeholder="mail@email.com"
                type="email"
                autoComplete="email"
                name="email"
                onSave={(email) => saveData({ email: email.trim() })}
                validation={(v) => (emailValidator.validate(v) ? null : 'Not a valid email')}
            />
            <PhoneInput
                half
                label="Phone"
                attention={!phone}
                defaultValue={phone}
                placeholder="+123456789"
                type="tel"
                autoComplete="tel"
                name="phone"
                onSave={(phone) => saveData({ phone: phone.trim() })}
            />
            <PasswordChanger half onSave={saveData} />

            <DatePickerPopup
                half
                maxDate={new Date()}
                minDate={false}
                label={'Birthday'}
                disabled={identityVerified}
                onSave={(date) => saveData({ birthday: date })}
                initialDate={birthday}
            />
            <ImageUploader
                half
                label="Profile picture"
                buttonText="change picture"
                onSave={updateKey('picture')}
                error={editsMap.profilePictureId?.message}
                displayError
            />
        </SettingsSection>
    );
};

export default BasicSection;
