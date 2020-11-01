import React, { useState } from 'react';
import { Input } from '../../../components/FormComponents';

import { Row, TeritaryButton, PrimaryButton } from '../../../components/Blocks';
import Popup from '../../../components/common/Popup';

const PasswordChanger = ({ onSave }) => {
    const [showing, setShowing] = useState(false);
    const [password, setPassword] = useState(null);
    const [rPassword, setRPassword] = useState(null);

    const validateLength = (val) => {
        if (!val || val.length < 6) {
            return 'Password must be at least 6 characters';
        }
    };

    const validateEqual = (val) => {
        if (password !== val) {
            return 'Passwords are not the same';
        }
    };

    const validate = () => {
        return [validateEqual(rPassword), validateLength(password)].some((v) => !v);
    };

    const save = () => {
        if (validate()) {
            onSave({ password });
            setShowing(false);
        }
    };

    return (
        <>
            <Input
                half
                type="button"
                onClick={(s) => setShowing(true)}
                label="Password"
                buttonText="Change password"
            />
            <Popup showing={showing} onClickOutside={(_) => setShowing(false)} width={'520px'}>
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        save();
                    }}
                >
                    <Input
                        label="New password"
                        placeholder={'Min. 6 characters'}
                        type="password"
                        autoComplete="new-password"
                        onSave={setPassword}
                        validation={validateLength}
                    />
                    <Input
                        label="Repeat password"
                        placeholder={'Min. 6 characters'}
                        type="password"
                        autoComplete="new-password"
                        onSave={setRPassword}
                        validation={validateEqual}
                    />

                    <Row right>
                        <TeritaryButton type="button" onClick={(_) => setShowing(false)}>
                            Cancel
                        </TeritaryButton>
                        <PrimaryButton type="submit">Save</PrimaryButton>
                    </Row>
                </form>
            </Popup>
        </>
    );
};

export default PasswordChanger;
