import React, { useState } from 'react';
import { Input } from '../../../components/FormComponents';
import Popup from '../../../components/common/Popup';
import LazyLocationEditor from './LocationsEditor';

const LocationPicker = ({ initialLocation, isPro, isActive, onClose }) => {
    const [showing, setShowing] = useState(isActive);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    return (
        <>
            <Input
                type="button"
                onClick={(s) => setShowing(true)}
                label="Location"
                buttonText={initialLocation ? initialLocation.name : 'Update location'}
            />
            <Popup showing={showing} onClickOutside={(_) => closeModal()} noPadding>
                <LazyLocationEditor isPro={isPro} />
            </Popup>
        </>
    );
};

export default LocationPicker;
