import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Input } from '../../../components/FormComponents';
import { Row, TeritaryButton, PrimaryButton } from '../../../components/Blocks';
import Popup from '../../../components/common/Popup';
import Map from '../../../components/common/Map';
import GeoCoder from '../../../utils/GeoCoder';
import LazyLocationEditor from './LocationsEditor';

const LocationPicker = ({ initialLocation, save, isActive, onClose }) => {
    const [location, setLocation] = useState(
        initialLocation
            ? {
                  lat: initialLocation.latitude,
                  lng: initialLocation.longitude,
                  name: initialLocation.name,
                  radius: initialLocation.radius,
              }
            : null
    );
    const [error, setError] = useState(null);
    const [showing, setShowing] = useState(isActive);

    const closeModal = () => {
        setShowing(false);
        onClose && onClose();
    };

    const updateMap = debounce((location) => {
        if (location) {
            //Getting the coordinates of the playing location
            GeoCoder.codeAddress(location, (geoResult) => {
                if (geoResult.error) {
                    setError('City not found');
                } else {
                    setLocation((l) => ({
                        ...l,
                        ...geoResult.position,
                        name: location,
                    }));
                }
            });
        }
    }, 500);

    const onRadiusChange = (radius) =>
        setLocation((l) => ({
            ...l,
            radius,
        }));

    const onCoordinatesChange = ({ lat, lng }) =>
        setLocation((l) => ({
            ...l,
            lat,
            lng,
        }));

    const onSave = () => {
        if (!location) {
            setError('No location selected');
            return;
        }
        closeModal();
        save({
            name: location.name,
            radius: location.radius,
            latitude: location.lat,
            longitude: location.lng,
        });
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
                <LazyLocationEditor />
            </Popup>
        </>
    );
};

export default LocationPicker;
