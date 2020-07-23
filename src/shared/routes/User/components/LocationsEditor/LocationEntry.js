import React, { useState, useEffect, ReactDOM, useRef } from 'react';
import { useMutation } from 'react-apollo';
import styled from 'styled-components';
import { Icon, InlineIcon } from '@iconify/react';
import saveIcon from '@iconify/icons-ion/ios-checkmark';
import cancelIcon from '@iconify/icons-ion/close';
import editIcon from '@iconify/icons-ion/pencil';
import Skeleton from 'react-loading-skeleton';
import infoIcon from '@iconify/icons-ion/information-circle';

import airplaneIcon from '@iconify/icons-ion/airplane';
import searchIcon from '@iconify/icons-ion/search';
import moment from 'moment-timezone';
import { Row, RoundButton, SmartButton } from 'components/Blocks';
import { BodyBold, BodySmall, Body } from 'components/Text';
import { Input, InputRow, Label } from 'components/FormComponents';
import DatePickerPopup from 'components/DatePickerPopup';
import GeoCoder from 'utils/GeoCoder';
import useDebounce from 'components/hooks/useDebounce';
import { getErrorMessage } from 'utils/errorHandler';
import Tooltip from 'components/Tooltip';
import { MY_LOCATIONS, UPDATE_LOCATION, ADD_LOCATION, REMOVE_LOCATION } from './gql';

import scaleGif from './assets/scale.gif';
import moveGif from './assets/move.gif';

const LocationEntry = ({
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
    isPrimary,
    loading,
}) => {
    const [error, setError] = useState();
    const format = (d) => moment(d).format('ll');
    const [searchName, setSearchName] = useState();
    const debouncedLocation = useDebounce(searchName, 500);
    const inputRef = useRef();

    useEffect(() => {
        if (editMode) {
            setTimeout(() => {
                if (inputRef.current) {
                    inputRef.current.focus();
                }
            }, 100);
        }
    }, [editMode]);

    const [save, { loading: saving }] = useMutation(id !== 'NEW' ? UPDATE_LOCATION : ADD_LOCATION, {
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
        onCompleted: () => toggleEditMode(true),
        onError: (error) => setError(getErrorMessage(error)),
        refetchQueries: [{ query: MY_LOCATIONS }],
    });

    const [remove, { loading: removing }] = useMutation(REMOVE_LOCATION, {
        variables: {
            id,
        },
        onError: (error) => setError(getErrorMessage(error)),
        refetchQueries: [{ query: MY_LOCATIONS }],
    });

    useEffect(() => {
        if (debouncedLocation) {
            //Getting the coordinates of the playing location
            GeoCoder.codeAddress(debouncedLocation, (geoResult) => {
                if (geoResult.error) {
                    setError('City not found');
                } else {
                    updateLocation({
                        id,
                        latitude: geoResult.position.lat,
                        longitude: geoResult.position.lng,
                        radius: 25000,
                    });
                }
            });
        }
    }, [debouncedLocation, id, updateLocation]);

    const handleSave = () => {
        save();
    };

    const handleCancel = () => {
        toggleEditMode(false);
    };

    if (loading || saving) {
        return (
            <LocationWrapper>
                <Skeleton />
            </LocationWrapper>
        );
    }

    return (
        <LocationWrapper key={id} editMode={editMode} onClick={!editMode ? toggleEditMode : null}>
            <Row middle between>
                {editMode ? (
                    <div style={{ position: 'relative', width: '100%' }}>
                        <Input
                            ref={inputRef}
                            autoFocus={editMode}
                            defaultValue={name}
                            onChange={(name) => {
                                setError(null);
                                updateLocation({ id, name });
                                setSearchName(name);
                            }}
                            labelStyle={{ marginBottom: 0 }}
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
                        <BodySmall
                            style={{
                                marginBottom: isPrimary ? 0 : 15,
                                marginTop: 6,
                                textAlign: 'center',
                            }}
                        >
                            Adjust the area using the circle on the map{' '}
                            <Tooltip content={<HowToDo />}>
                                {({ ref, close, open }) => (
                                    <span ref={ref} onMouseEnter={open} onMouseLeave={close}>
                                        <InlineIcon
                                            icon={infoIcon}
                                            style={{
                                                fontSize: '1.2em',
                                                top: '4px',
                                                position: 'relative',
                                            }}
                                        />
                                    </span>
                                )}
                            </Tooltip>
                        </BodySmall>
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
                        {`${fromDate ? format(fromDate) : 'Now'} ${toDate ? '-' : ''} ${
                            toDate ? format(toDate) : ''
                        }`}
                    </BodySmall>
                </Row>
            )}
            {editMode && !isPrimary && (
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
                            minDate={new Date()}
                            maxDate={false}
                            initialDate={fromDate}
                            onSave={(fromDate) => updateLocation({ id, fromDate })}
                        />
                        <DatePickerPopup
                            half
                            buttonText="End date"
                            removable
                            initialDate={toDate}
                            minDate={fromDate || new Date()}
                            maxDate={false}
                            onSave={(toDate) => updateLocation({ id, toDate })}
                        />
                    </InputRow>
                </>
            )}
            {editMode && (
                <Row right style={{ marginTop: 12 }}>
                    {id && !isPrimary && (
                        <SmartButton
                            level="tertiary"
                            loading={removing}
                            style={{ minWidth: 0, padding: '0 9px' }}
                            onClick={remove}
                        >
                            Remove
                        </SmartButton>
                    )}
                    <div style={{ flex: 1 }} />
                    <CancelButton onClick={handleCancel} />
                    <SaveButton onClick={handleSave} />
                </Row>
            )}
        </LocationWrapper>
    );
};

const HowToDo = () => {
    return (
        <GifsWrapper>
            <BodySmall>Move the area with the dot in the center of the circle.</BodySmall>
            <img src={moveGif} title="Move the area" />
            <BodySmall>Resize the area with the dots on the edge of the circle.</BodySmall>
            <img src={scaleGif} title="Resize the area" />
        </GifsWrapper>
    );
};

const GifsWrapper = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 200px;
    align-items: center;
    > img {
        height: 100px;
        width: 150px;
        margin-bottom: 12px;
        object-fit: cover;
    }
`;

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

export default LocationEntry;
