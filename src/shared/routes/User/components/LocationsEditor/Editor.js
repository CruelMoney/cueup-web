import React, { useState, useEffect, useCallback } from 'react';
import { useQuery, useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import saveIcon from '@iconify/icons-ion/ios-checkmark';
import cancelIcon from '@iconify/icons-ion/close';
import editIcon from '@iconify/icons-ion/pencil';

import airplaneIcon from '@iconify/icons-ion/airplane';
import searchIcon from '@iconify/icons-ion/search';
import pinIcon from '@iconify/icons-ion/location';
import moment from 'moment-timezone';
import { Row, Col, TeritaryButton, RoundButton } from 'components/Blocks';
import { Title, BodyBold, BodySmall, Body } from 'components/Text';
import { Input, InputRow, Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import { validators } from 'components/hooks/useForm';
import GeoCoder from 'utils/GeoCoder';
import useDebounce from 'components/hooks/useDebounce';
import Map from './Map';
import { MY_LOCATIONS, UPDATE_LOCATION } from './gql';

const LocationEditor = () => {
    const { data } = useQuery(MY_LOCATIONS);
    const locations = data?.me?.playingLocations || [];

    return <Editor key={locations.length} initialLocations={locations} />;
};

const Editor = ({ initialLocations }) => {
    const [editId, setEditId] = useState();
    const [locations, setLocations] = useState(initialLocations);

    const validate = () => {
        // check that the user has at least 1 location
        // and that at least 1 location does not have time period
    };

    const updateLocation = useCallback((data) => {
        console.log({ data });
        setLocations((ll) => {
            return ll.map((l) => {
                if (l.id === data.id) {
                    return {
                        ...l,
                        ...data,
                    };
                }
                return l;
            });
        });
    }, []);

    return (
        <Row between>
            <Col
                style={{
                    width: 400,
                    padding: 24,
                    backgroundColor: '#f6f9fc',
                    alignSelf: 'stretch',
                }}
            >
                <Title style={{ marginBottom: 30 }}>Playing locations</Title>
                <Row middle between style={{ marginBottom: 15 }}>
                    <BodyBold>
                        <Icon icon={pinIcon} style={{ top: 2, position: 'relative' }} /> Based in:{' '}
                        {locations[0]?.name}
                    </BodyBold>
                    <Body>{locations.length} locations</Body>
                </Row>
                {locations.map((l, idx) => (
                    <Location
                        key={l.id || idx}
                        {...l}
                        editMode={l.id === editId}
                        updateLocation={updateLocation}
                        toggleEditMode={() => {
                            if (editId === l.id) {
                                setEditId(null);
                            } else {
                                setEditId(l.id);
                            }
                        }}
                    />
                ))}
                <TeritaryButton fullWidth inverse>
                    Add new
                </TeritaryButton>
                <BodySmall style={{ marginTop: 'auto' }}>
                    Add the places you want to get gigs in. Adding unnecessary locations, that you
                    cannot play in, can impact your profile negatively.
                </BodySmall>
            </Col>
            <MapWrapper>
                <Map locations={locations} />
            </MapWrapper>
        </Row>
    );
};

const Location = ({
    id,
    name,
    radius,
    latitude,
    longitude,
    fromDate,
    toDate,
    editMode,
    toggleEditMode,
    updateLocation,
}) => {
    const [error, setError] = useState();
    const format = (d) => moment(d).format('ll');
    const debouncedLocation = useDebounce(name, 500);

    const [save, { loading }] = useMutation(UPDATE_LOCATION, {
        variables: {
            id,
            location: {
                name,
                radius,
                latitude,
                longitude,
            },
            fromDate,
            toDate,
        },
    });

    useEffect(() => {
        if (debouncedLocation) {
            //Getting the coordinates of the playing location
            GeoCoder.codeAddress(debouncedLocation, (geoResult) => {
                console.log({ geoResult });
                if (geoResult.error) {
                    setError('City not found');
                } else {
                    updateLocation({
                        id,
                        latitude: geoResult.position.lat,
                        longitude: geoResult.position.lng,
                    });
                }
            });
        }
    }, [debouncedLocation, id, updateLocation]);

    const handleSave = () => {
        save();
        toggleEditMode();
    };

    return (
        <LocationWrapper key={id} editMode={editMode}>
            <Row middle between>
                {editMode ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Input
                            autoFocus
                            defaultValue={name}
                            onChange={(name) => {
                                setError(null);
                                updateLocation({ id, name });
                            }}
                            validation={[validators.required]}
                            error={error}
                        />
                        <Body
                            style={{
                                position: 'absolute',
                                right: '9px',
                                top: '14px',
                            }}
                        >
                            <Icon icon={searchIcon} />
                        </Body>
                    </div>
                ) : (
                    <BodyBold>{name}</BodyBold>
                )}
                {!editMode && (
                    <EditButton
                        style={{ position: 'relative', marginTop: 0, marginRight: 0 }}
                        onClick={toggleEditMode}
                    />
                )}
            </Row>
            {!editMode && (fromDate || toDate) && (
                <Row middle>
                    <BodySmall>
                        <Icon
                            icon={airplaneIcon}
                            style={{ marginRight: 5, top: 2, position: 'relative' }}
                        />
                        {`${fromDate ? format(fromDate) : 'Now'} ${toDate ? '-' : ''} ${
                            toDate ? format(toDate) : ''
                        }`}
                    </BodySmall>
                </Row>
            )}
            {editMode && (
                <>
                    <Label>
                        <Icon
                            icon={airplaneIcon}
                            style={{ marginRight: 5, top: 3, position: 'relative' }}
                        />
                        Travel dates
                    </Label>
                    <InputRow middle small style={{ marginBottom: -30 }}>
                        <DatePickerPopup
                            half
                            buttonText="Start date"
                            removable
                            initialDate={fromDate}
                            onSave={(fromDate) => updateLocation({ id, fromDate })}
                        />
                        <DatePickerPopup
                            half
                            buttonText="End date"
                            removable
                            initialDate={toDate}
                            onSave={(toDate) => updateLocation({ id, toDate })}
                        />
                    </InputRow>
                </>
            )}
            {editMode && (
                <Row right style={{ marginTop: 12 }}>
                    <CancelButton onClick={toggleEditMode} />
                    <SaveButton onClick={handleSave} />
                </Row>
            )}
        </LocationWrapper>
    );
};

const SaveButton = (props) => (
    <RoundButton {...props} title="Save">
        <Icon icon={saveIcon} width={38} height={38} />
    </RoundButton>
);

const CancelButton = (props) => (
    <RoundButton {...props} title="Cancel">
        <Icon icon={cancelIcon} width={22} height={22} />
    </RoundButton>
);

const EditButton = (props) => (
    <RoundButton {...props} title="Edit">
        <Icon icon={editIcon} width={22} height={22} />
    </RoundButton>
);

const MapWrapper = styled.div`
    height: 800px;
    width: 1200px;
`;

const LocationWrapper = styled.div`
    padding: 1em;
    background-color: #fff;
    width: 100%;
    border-radius: 10px;
    margin-bottom: 12px;
    border: 2px solid #98a4b326;
    cursor: ${({ editMode }) => (editMode ? 'default' : 'pointer')};
    transition: transform 250ms ease, box-shadow 250ms ease;
    &:hover {
        background-color: rgba(255, 255, 255, 0.75);
    }
`;

export default LocationEditor;
