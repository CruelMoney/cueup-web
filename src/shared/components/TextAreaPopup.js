import React, { useState } from 'react';
import { Input, TextArea } from './FormComponents';
import { Row, TeritaryButton, PrimaryButton } from './Blocks';
import Popup from './common/Popup';
import { BodySmall } from './Text';

const TextAreaPopup = ({
    initialValue,
    save,
    label,
    characters = 100,
    children,
    error,
    attention,
    isActive,
    onClose,
    v2,
    ...props
}) => {
    const [value, setValue] = useState(initialValue);
    const [showing, setShowing] = useState(isActive);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    return (
        <>
            <Input
                half
                type="button"
                label={label}
                buttonText={'Edit'}
                onClick={(_) => setShowing(true)}
                error={error}
                attention={attention}
                v2={v2}
            />

            <Popup showing={showing} onClickOutside={closeModal} width={'520px'}>
                {children}
                <TextArea
                    defaultValue={value}
                    style={{
                        height: '400px',
                    }}
                    onChange={(e) => setValue(e.target.value)}
                    {...props}
                />
                <Row style={{ marginTop: '15px' }} right>
                    <BodySmall
                        style={{
                            alignSelf: 'flex-end',
                            marginRight: 'auto',
                        }}
                    >{`${value ? value.replace(/\s/g, '').length : 0} / ${characters}`}</BodySmall>

                    <TeritaryButton type="button" onClick={closeModal}>
                        Cancel
                    </TeritaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={() => {
                            closeModal();
                            save(value);
                        }}
                    >
                        Save
                    </PrimaryButton>
                </Row>
            </Popup>
        </>
    );
};

export default TextAreaPopup;
