import React, { useState } from 'react';
import constants from '../constants/constants';
import { Input, ButtonText } from './FormComponents';
import { Row, TeritaryButton, PrimaryButton } from './Blocks';
import Popup from './common/Popup';
import { ToggleButtonHandler } from './common/ToggleButtonHandler';

const GenreSelector = ({ initialGenres = [], save, half, isActive, onClose }) => {
    const [genres, setGenres] = useState(initialGenres);
    const [showing, setShowing] = useState(isActive);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    return (
        <>
            <Input
                half={half}
                type="button"
                onClick={(s) => setShowing(true)}
                label="Genres"
                buttonText={<ButtonText>{initialGenres.join(', ')}</ButtonText>}
            />
            <Popup showing={showing} onClickOutside={(_) => closeModal()} width={'520px'}>
                <ToggleButtonHandler
                    enableAdditions
                    color={'#50E3C2'}
                    potentialValues={constants.GENRES}
                    errors={[]}
                    value={initialGenres}
                    onChange={setGenres}
                />

                <Row style={{ marginTop: '15px' }} right>
                    <TeritaryButton type="button" onClick={(_) => closeModal()}>
                        Cancel
                    </TeritaryButton>
                    <PrimaryButton
                        type="button"
                        onClick={() => {
                            closeModal();
                            save(genres);
                        }}
                    >
                        Save
                    </PrimaryButton>
                </Row>
            </Popup>
        </>
    );
};

export default GenreSelector;
