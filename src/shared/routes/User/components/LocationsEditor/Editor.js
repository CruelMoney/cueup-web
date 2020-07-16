import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

import pinIcon from '@iconify/icons-ion/location';
import { Row, Col, TeritaryButton } from 'components/Blocks';
import { Title, BodyBold, BodySmall, Body } from 'components/Text';

import Map from './Map';
import { MY_LOCATIONS } from './gql';
import LocationEntry from './LocationEntry';

const LocationEditor = () => {
    const { data, loading } = useQuery(MY_LOCATIONS);
    const locations = data?.me?.playingLocations || [];

    return <Editor userLocations={locations} loading={loading} />;
};

const Editor = ({ userLocations, loading }) => {
    const [editId, setEditId] = useState();
    const [locations, setLocations] = useState(userLocations);

    const editingLocation = locations.find((l) => l.id === editId);

    useEffect(() => {
        setLocations(userLocations);
    }, [userLocations]);

    const addNewLocation = () => {
        setEditId('NEW');
        setLocations((ll) => [...ll, { id: 'NEW' }]);
    };

    const updateLocation = useCallback((data) => {
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

    const isAddingNew = locations.some((l) => l.id === 'NEW');

    const toggleEditMode = useCallback(
        (l, isSave) => {
            if (!isSave) {
                setLocations((ll) => ll.filter((l) => l.id !== 'NEW'));
            }

            if (editId === l.id) {
                // close
                setEditId(null);
            } else {
                // open
                setEditId(l.id);
            }
        },
        [editId]
    );

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
                    <LocationEntry
                        key={l.id || idx}
                        isPrimary={idx === 0}
                        {...l}
                        editMode={l.id === editId}
                        updateLocation={updateLocation}
                        toggleEditMode={(isSave) => toggleEditMode(l, isSave)}
                    />
                ))}
                {loading && [<LocationEntry key={1} loading />, <LocationEntry key={2} loading />]}
                {!isAddingNew && (
                    <TeritaryButton fullWidth inverse onClick={addNewLocation}>
                        Add new
                    </TeritaryButton>
                )}
                <BodySmall style={{ marginTop: 'auto' }}>
                    Add the places you want to get gigs in. Adding unnecessary locations, that you
                    cannot play in, can impact your profile negatively.
                </BodySmall>
            </Col>
            <MapWrapper>
                <Map
                    locations={
                        editingLocation?.latitude
                            ? [editingLocation]
                            : locations.filter((l) => l.longitude && l.latitude)
                    }
                    editId={editId}
                    updateLocation={updateLocation}
                />
            </MapWrapper>
        </Row>
    );
};

const MapWrapper = styled.div`
    height: 800px;
    width: 1200px;
`;

export default LocationEditor;
