import React, { useState, useEffect, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

import pinIcon from '@iconify/icons-ion/location';
import { useRouteMatch, useHistory } from 'react-router';
import { Row, Col, TeritaryButton } from 'components/Blocks';
import { Title, BodyBold, BodySmall, Body } from 'components/Text';

import { ProFeature } from 'components/FormComponents';
import Map from './Map';
import { MY_LOCATIONS } from './gql';
import LocationEntry from './LocationEntry';

const LocationEditor = (props) => {
    const { data, loading } = useQuery(MY_LOCATIONS);
    const locations = data?.me?.playingLocations || [];

    return <Editor userLocations={locations} loading={loading} {...props} />;
};

const Editor = ({ userLocations, loading, isPro }) => {
    const [editId, setEditId] = useState();
    const [locations, setLocations] = useState(userLocations);
    const editingLocation = locations.find((l) => l.id === editId);

    const match = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
        setLocations(userLocations);
    }, [userLocations]);

    const addNewLocation = () => {
        setEditId('NEW');
        setLocations((ll) => [...ll, { id: 'NEW', radius: 25000 }]);
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
                setLocations(userLocations);
            }

            if (editId === l.id) {
                // close
                setEditId(null);
            } else {
                // open
                setEditId(l.id);
            }
        },
        [editId, userLocations]
    );

    const goPro = () => {
        history.push(match.url + '/get-pro');
    };

    return (
        <EditorStyle between>
            <LeftSide>
                <Title style={{ marginBottom: 30 }}>Playing locations</Title>
                <Row middle between style={{ marginBottom: 15 }}>
                    <BodyBold>
                        <Icon icon={pinIcon} style={{ top: 2, position: 'relative' }} /> Based in:{' '}
                        {locations[0]?.name}
                    </BodyBold>
                    <Body>{locations.length} locations</Body>
                </Row>
                <LocationsList>
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
                    {loading && [
                        <LocationEntry key={1} loading />,
                        <LocationEntry key={2} loading />,
                    ]}
                    {!isAddingNew && (
                        <TeritaryButton
                            fullWidth
                            inverse
                            style={{ minHeight: '40px' }}
                            onClick={() => (isPro ? addNewLocation() : goPro())}
                        >
                            Add new {!isPro && <ProFeature style={{ top: 0 }} disabled />}
                        </TeritaryButton>
                    )}
                </LocationsList>

                <div style={{ flex: 1 }} />
                <BodySmall style={{ marginTop: '30px' }}>
                    Add the places where you want to get gigs. Adding unnecessary locations, that
                    you cannot play in, can impact your profile negatively.
                </BodySmall>
            </LeftSide>
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
        </EditorStyle>
    );
};

const MapWrapper = styled.div`
    height: 900px;
    max-height: 90vh;
    width: 1200px;
`;

const EditorStyle = styled(Row)`
    height: 900px;
    max-height: 90vh;
`;

const LeftSide = styled(Col)`
    width: 400px;
    min-width: 400px;
    padding: 24px;
    background-color: #f6f9fc;
    align-self: stretch;
`;

const LocationsList = styled(Col)`
    margin: 0 -24px;
    padding: 0 24px;
    max-height: 70vh;
    overflow-y: scroll;
`;

export default LocationEditor;
