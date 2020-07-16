import React, { useState } from 'react';
import { useQuery } from 'react-apollo';
import styled from 'styled-components';
import { Icon } from '@iconify/react';
import airplaneIcon from '@iconify/icons-ion/airplane';
import searchIcon from '@iconify/icons-ion/search';
import pinIcon from '@iconify/icons-ion/location';
import moment from 'moment-timezone';
import { Row, Col, TeritaryButton, TextInput } from 'components/Blocks';
import { Title, BodyBold, BodySmall, Body } from 'components/Text';
import { Input, InputRow, Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import { validators } from 'components/hooks/useForm';
import EditButton from '../EditButton';
import Map from './Map';
import { MY_LOCATIONS } from './gql';

const Editor = () => {
    const [editIndex, setEditIndex] = useState(0);
    const { data } = useQuery(MY_LOCATIONS);

    const locations = data?.me?.playingLocations || [];

    const onSave = () => {
        // check that the user has at least 1 location
        // and that at least 1 location does not have time period
    };

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
                        <Icon icon={pinIcon} style={{ top: 2, position: 'relative' }} /> based in:{' '}
                        {locations[0]?.name}
                    </BodyBold>
                    <Body>{locations.length} locations</Body>
                </Row>
                {locations.map((l, idx) => (
                    <Location key={l.id || idx} {...l} editMode={idx === editIndex} />
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

const Location = ({ id, name, fromDate, toDate, editMode }) => {
    const [internalState, setState] = useState({
        name,
        fromDate,
        toDate,
    });
    const format = (d) => moment(d).format('ll');

    return (
        <LocationWrapper key={id} editMode={editMode}>
            <Row middle between>
                {editMode ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Input
                            autoFocus
                            defaultValue={internalState.name}
                            onSave={(name) => setState((s) => ({ ...s, name }))}
                            validation={[validators.required]}
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
                    <EditButton style={{ position: 'relative', marginTop: 0, marginRight: 0 }} />
                )}
            </Row>
            {!editMode && (fromDate || toDate) && (
                <Row middle>
                    <BodySmall>
                        <Icon
                            icon={airplaneIcon}
                            style={{ marginRight: 5, top: 2, position: 'relative' }}
                        />
                        {`${fromDate && format(fromDate)} ${fromDate && toDate && '-'} ${
                            toDate && format(toDate)
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
                            onSave={(fromDate) => setState((s) => ({ ...s, fromDate }))}
                        />
                        <DatePickerPopup
                            half
                            buttonText="End date"
                            removable
                            onSave={(toDate) => setState((s) => ({ ...s, toDate }))}
                        />
                    </InputRow>
                </>
            )}
        </LocationWrapper>
    );
};

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

export default Editor;
