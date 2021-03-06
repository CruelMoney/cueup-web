import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { GoogleMap, Circle } from '@react-google-maps/api';
import { getCenter, getBounds } from 'geolib';
import { useLazyLoadScript } from 'components/hooks/useLazyLoadScript';

const EditorMap = ({ locations, editId, updateLocation }) => {
    const map = useRef();
    const [loaded, setLoadedd] = useState(false);

    const center = getCenter(locations);
    const bounds = useMemo(() => {
        if (!locations.length) {
            return null;
        }
        if (locations.length === 1) {
            const l = locations[0];
            const c = new window.google.maps.Circle({
                center: {
                    lat: l.latitude,
                    lng: l.longitude,
                },
                radius: l.radius,
            });
            return c.getBounds();
        }
        const bb = getBounds(locations);
        return new window.google.maps.LatLngBounds(
            { lat: bb.minLat, lng: bb.minLng },
            { lat: bb.maxLat, lng: bb.maxLng }
        );
    }, [locations]);

    useEffect(() => {
        if (loaded && map.current && bounds) {
            map.current.fitBounds(bounds);
        }
    }, [bounds, loaded]);

    const initialCenter = {
        lat: center?.latitude || 40.52,
        lng: center?.longitude || 34.34,
    };

    return (
        <GoogleMap
            mapContainerStyle={{
                height: '100%',
                width: '100%',
                opacity: loaded ? 1 : 0,
                transition: 'opacity 500ms ease',
            }}
            onLoad={(m) => {
                map.current = m;
                setTimeout(() => {
                    bounds && map.current.fitBounds(bounds);
                    setLoadedd(true);
                }, 500);
            }}
            options={{
                disableDefaultUI: true,
                backgroundColor: '#f6f8f9',
                zoomControl: true,
                styles,
                zoom: center ? 5 : 3,
            }}
            center={initialCenter}
        >
            {locations.map((l) => (
                <SmartCircle
                    key={l.id}
                    editable={l.id === editId}
                    updateLocation={updateLocation}
                    {...l}
                />
            ))}
        </GoogleMap>
    );
};

const SmartCircle = ({ id, latitude, longitude, radius, editable, updateLocation }) => {
    const myCircle = useRef();

    const handleRadiusChange = useCallback(() => {
        if (myCircle.current) {
            const circleRadius = myCircle.current.getRadius();
            updateLocation({ id, radius: circleRadius });
        }
    }, [updateLocation, id]);

    // max size
    useEffect(() => {
        if (radius > 500000) {
            myCircle.current.setRadius(500000);
        }
    }, [radius]);

    const handleLocationChange = useCallback(() => {
        if (myCircle.current) {
            const data = {
                latitude: myCircle.current.getCenter().lat(),
                longitude: myCircle.current.getCenter().lng(),
            };
            if (latitude !== data.latitude || longitude !== data.longitude) {
                updateLocation({
                    id,
                    ...data,
                });
            }
        }
    }, [updateLocation, id, latitude, longitude]);

    return (
        <Circle
            key={id}
            onLoad={(c) => (myCircle.current = c)}
            options={{
                fillColor: '#25F4D2',
                strokeWeight: editable ? 2 : 0,
                suppressUndo: true,
            }}
            editable={editable}
            center={{
                lat: latitude,
                lng: longitude,
            }}
            radius={radius}
            onCenterChanged={handleLocationChange}
            onRadiusChanged={handleRadiusChange}
        />
    );
};

const MapLoader = ({ ...props }) => {
    const [loadScript, { loaded }] = useLazyLoadScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    useEffect(() => {
        loadScript();
    }, [loadScript]);

    if (!loaded) {
        return null;
    }

    return <EditorMap {...props} />;
};

const styles = [
    {
        stylers: [{ visibility: 'off' }],
    },
    {
        featureType: 'water',
        stylers: [{ visibility: 'simplified' }, { color: '#ffffff' }],
    },
    {
        featureType: 'landscape',
        stylers: [{ visibility: 'on' }, { color: '#32325D' }],
    },
    {
        featureType: 'administrative.neighborhood',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.neighborhood',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#32325D' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#32325D' }, { visibility: 'on' }],
    },

    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }, { visibility: 'on' }],
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ color: '#42425E' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.province',
        stylers: [{ visibility: 'on' }],
    },
    {
        featureType: 'administrative.province',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.province',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#32325D' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.country',
        stylers: [{ visibility: 'on' }],
    },
    {
        featureType: 'administrative.country',
        elementType: 'labels.text.fill',
        stylers: [{ color: '#ffffff' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.country',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#32325D' }, { visibility: 'on' }],
    },
];

export default MapLoader;
