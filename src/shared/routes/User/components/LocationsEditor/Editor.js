import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Icon } from '@iconify/react';

import pinIcon from '@iconify/icons-ion/location';
import { useRouteMatch, useHistory } from 'react-router';
import { Row, Col, TeritaryButton, ShowBelow, CardSimple } from 'components/Blocks';
import { Title, BodyBold, BodySmall, Body } from 'components/Text';

import { ProFeature } from 'components/FormComponents';
import { useServerContext } from 'components/hooks/useServerContext';
import Map from './Map';
import { MY_LOCATIONS } from './gql';
import LocationEntry from './LocationEntry';
import scaleGif from './assets/scale.gif';
import moveGif from './assets/move.gif';

const LocationEditor = (props) => {
    const { data, loading } = useQuery(MY_LOCATIONS);
    const locations = data?.me?.playingLocations || [];

    return <Editor userLocations={locations} loading={loading} {...props} />;
};

const Editor = ({ userLocations, loading, isPro }) => {
    const [editId, setEditId] = useState();
    const [locations, setLocations] = useState(userLocations);
    const editingLocation = locations.find((l) => l.id === editId);
    const scrollRef = useRef();

    const { environment } = useServerContext();

    const match = useRouteMatch();
    const history = useHistory();

    useEffect(() => {
        setLocations(userLocations);
    }, [userLocations]);

    const addNewLocation = () => {
        setEditId('NEW');
        setLocations((ll) => [...ll, { id: 'NEW', radius: 25000 }]);
        setTimeout(() => {
            if (scrollRef.current) {
                scrollRef.current.scroll({ top: 9999, behavior: 'smooth' });
            }
        }, 100);
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

    const addNewLocationDisabled = locations?.length > 0 && !isPro;

    return (
        <EditorStyle between>
            <LeftSide>
                <ShowBelow width={450}>
                    <a
                        href={encodeURI(
                            `${environment.GQL_DOMAIN}/shareLink?iosLink=${encodeURIComponent(
                                'https://apps.apple.com/us/app/cueup-gigs/id1458267647?mt=8'
                            )}&androidLink=${encodeURIComponent(
                                'https://play.google.com/store/apps/details?id=io.cueup.gigs'
                            )}`
                        )}
                    >
                        <div
                            style={{
                                backgroundColor: '#fff',
                                padding: 12,
                                marginBottom: 12,
                                borderRadius: 12,
                                border: '2px solid #50e3c2',
                            }}
                        >
                            <BodySmall>
                                Use the Cueup Gigs App for a better mobile experience.
                                <b> Download here.</b>
                            </BodySmall>
                        </div>
                    </a>
                </ShowBelow>
                <Title style={{ marginBottom: 30 }}>Playing locations</Title>
                <Row middle between style={{ marginBottom: 15 }}>
                    <BodyBold>
                        <Icon icon={pinIcon} style={{ top: 2, position: 'relative' }} /> Based in:{' '}
                        {locations[0]?.name}
                    </BodyBold>
                    <Body>{locations.length} locations</Body>
                </Row>
                <LocationsList ref={scrollRef}>
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
                            onClick={() => (addNewLocationDisabled ? goPro() : addNewLocation())}
                        >
                            Add new{' '}
                            {addNewLocationDisabled && <ProFeature style={{ top: 0 }} disabled />}
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
                {editId && editingLocation?.latitude && <HowToDo />}
            </MapWrapper>
        </EditorStyle>
    );
};

const HowToDo = () => {
    return (
        <GifsWrapper shadow>
            <BodySmall>Move:</BodySmall>
            <img src={moveGif} title="Move the area" />
            <BodySmall>Resize:</BodySmall>
            <img src={scaleGif} title="Resize the area" />
        </GifsWrapper>
    );
};

const GifsWrapper = styled(CardSimple)`
    display: flex;
    flex-direction: column;
    max-width: 200px;
    align-items: center;
    position: absolute;
    top: 1em;
    left: 1em;
    padding: 1em 1em 0 1em;
    > img {
        height: 100px;
        width: 150px;
        margin-bottom: 12px;
        object-fit: cover;
    }
`;

const MapWrapper = styled.div`
    height: 900px;
    max-height: 90vh;
    width: 100%;
    position: relative;
    @media only screen and (max-width: 768px) {
        display: none;
    }
`;

const EditorStyle = styled(Row)`
    height: 900px;
    max-height: 90vh;
    max-width: max(450px, 95vw);
    width: 95vw;
`;

const LeftSide = styled(Col)`
    width: 400px;
    min-width: 400px;
    padding: 24px;
    background-color: #f6f9fc;
    align-self: stretch;
    @media only screen and (max-width: 768px) {
        width: min(100vw, 400px);
        min-width: min(100vw, 400px);
    }
`;

const LocationsList = styled(Col)`
    margin: 0 -24px;
    padding: 0 24px;
    max-height: 70vh;
    overflow-y: scroll;
`;

export default LocationEditor;
