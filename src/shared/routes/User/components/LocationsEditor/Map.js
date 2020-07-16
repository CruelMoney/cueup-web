import React, { useState, useRef, useEffect, useMemo } from 'react';
import useScript from '@charlietango/use-script';
import { GoogleMap, Circle } from '@react-google-maps/api';
import { getCenter, getBounds } from 'geolib';

const EditorMap = ({ locations }) => {
    const map = useRef();
    const [loaded, setLoadedd] = useState(false);
    // // update radius
    // useEffect(() => {
    //     if (myCircle.current && radius) {
    //         if (radius !== currentRadius) {
    //             myCircle.current.setRadius(radius);
    //         }
    //     }
    // }, [radius, currentRadius]);

    // const handleRadiusChange = () => {
    //     if (myCircle.current) {
    //         const r = Math.min(myCircle.current.getRadius(), 1000000);
    //         setRadius(r);

    //         if (onRadiusChange) {
    //             onRadiusChange(r);
    //         }
    //     }
    // };

    // const handleLocationChange = () => {
    //     if (myCircle.current) {
    //         const data = {
    //             lat: myCircle.current.getCenter().lat(),
    //             lng: myCircle.current.getCenter().lng(),
    //         };

    //         if (onCoordinatesChange) {
    //             onCoordinatesChange(data);
    //         }
    //     }
    // };

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
        if (map.current && bounds) {
            map.current.fitBounds(bounds);
        }
    }, [bounds]);

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
                bounds && m.fitBounds(bounds);
                setTimeout(() => {
                    setLoadedd(true);
                }, 500);
            }}
            options={{
                disableDefaultUI: true,
                backgroundColor: '#f6f8f9',
                zoomControl: true,
                styles,
                zoom: 5,
            }}
            center={{
                lat: center?.latitude,
                lng: center?.longitude,
            }}
        >
            {locations.map(({ id, latitude, longitude, radius }) => (
                <Circle
                    key={id}
                    // onLoad={(c) => (myCircle.current = c)}
                    options={{
                        fillColor: '#25F4D2',
                        strokeWeight: 0,
                        suppressUndo: true,
                    }}
                    editable
                    center={{
                        lat: latitude,
                        lng: longitude,
                    }}
                    radius={radius}
                    // onCenterChanged={handleLocationChange}
                    // onRadiusChanged={handleRadiusChange}
                />
            ))}
        </GoogleMap>
    );
};

const MapLoader = ({ ...props }) => {
    const [loaded] = useScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

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
        featureType: 'administrative.locality',
        elementType: 'labels',
        stylers: [{ color: '#ffffff' }, { visibility: 'on' }],
    },
    {
        featureType: 'administrative.locality',
        elementType: 'labels.text.stroke',
        stylers: [{ color: '#32325D' }, { visibility: 'on' }],
    },
    {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [{ visibility: 'off' }],
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
