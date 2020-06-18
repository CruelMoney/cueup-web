import React, { useState } from 'react';
import debounce from 'lodash/debounce';
import LocationSelector from 'components/common/LocationSelectorSimple';
import { Input } from '../../../components/FormComponents';
import { Row, TeritaryButton, PrimaryButton } from '../../../components/Blocks';
import Popup from '../../../components/common/Popup';
import Map from '../../../components/common/Map';
import GeoCoder from '../../../utils/GeoCoder';

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
            <Popup showing={showing} onClickOutside={(_) => closeModal()} width={'520px'}>
                <LocationSelector
                    big
                    autocomplete="off"
                    name="location"
                    onChange={updateMap}
                    value={location && location.name}
                    label={'Location'}
                />

                {location ? (
                    <Map
                        key={location ? location.name : 'init'}
                        radius={location.radius || 25000}
                        name={'playingLocation'}
                        value={location}
                        editable={true}
                        color={'#50E3C2'}
                        radiusName="playingRadius"
                        locationName="playingLocation"
                        onRadiusChange={onRadiusChange}
                        onCoordinatesChange={onCoordinatesChange}
                    />
                ) : null}

                <Row style={{ marginTop: '15px' }} right>
                    <TeritaryButton type="button" onClick={(_) => closeModal()}>
                        Cancel
                    </TeritaryButton>
                    <PrimaryButton type="button" onClick={onSave}>
                        Save
                    </PrimaryButton>
                </Row>

                {error && <p className="error">{error}</p>}
            </Popup>
        </>
    );
};

export default LocationPicker;
