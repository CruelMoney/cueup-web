import React, { useState } from 'react';
import emailValidator from 'email-validator';

import { SettingsSection, Input } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';

import PhoneInput from 'components/common/PhoneInput';

import Popup from 'components/common/Popup';
import VerifyIdentity from './components/VerifyIdentity';

const BasicSection = ({ user, updateKey, saveData, modal, onModalClose }) => {
    const verifyIdentity = modal === 'verifyIdentity';

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
            stickyTop={'15px'}
            title={'Personal information'}
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

            <DatePickerPopup
                half
                maxDate={new Date()}
                minDate={false}
                label={'Birthday'}
                disabled={identityVerified}
                onSave={(date) => saveData({ birthday: date })}
                initialDate={birthday}
            />

            <VerifyIdentityPopup
                user={user}
                identityVerified={identityVerified}
                initialShowing={verifyIdentity}
                onClose={onModalClose}
            />
        </SettingsSection>
    );
};

const VerifyIdentityPopup = ({ user, onClose, identityVerified, initialShowing = false }) => {
    const [showing, setShowing] = useState(initialShowing);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    return (
        <>
            <Input
                half
                type="button"
                onClick={() => setShowing(true)}
                label="Verify identity"
                buttonText={identityVerified ? 'Verified' : 'Get verified'}
                success={identityVerified}
                disabled={identityVerified}
            />
            <Popup
                showing={showing}
                onClickOutside={(_) => closeModal()}
                style={{ maxWidth: '1000px' }}
            >
                <VerifyIdentity
                    isUpdate={identityVerified}
                    user={user}
                    onCancel={(_) => closeModal()}
                />
            </Popup>
        </>
    );
};

export default BasicSection;
