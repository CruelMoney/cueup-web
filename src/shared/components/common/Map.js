import React, { useState, useRef, useEffect } from 'react';
import { GoogleMap, Circle, useLoadScript } from '@react-google-maps/api';

/*
 * This is the modify version of:
 * https://developers.google.com/maps/documentation/javascript/examples/event-arguments
 *
 * Add <script src="https://maps.googleapis.com/maps/api/js"></script> to your HTML to provide google.maps reference
 *
 * We use React 0.14 stateless function components here.
 * https://facebook.github.io/react/blog/2015/09/10/react-v0.14-rc1.html#stateless-function-components
 */

const marker = {
    position: { lat: 56, lng: 10 },
    radius: 250000,
    key: 'Denmark',
    defaultAnimation: 2,
};

const SimpleMap = ({
    value,
    radius: initialRadius,
    mapOptions,
    onRadiusChange,
    onCoordinatesChange,
    defaultCenter,
    editable,
    color,
    hideRoads,
    noCircle,
    offsetCenter,
    bounds,
    largeScale,
    zoomScaler,
    hideNames,
    ...props
}) => {
    const [radius, setRadius] = useState(initialRadius);
    const myCircle = useRef();
    const currentRadius = myCircle.current?.getRadius();
    const map = useRef();

    // update center
    useEffect(() => {
        if (map.current && value) {
            map.current.panTo(value);

            if (myCircle.current) {
                const currentCenter = {
                    lat: myCircle.current.getCenter().lat(),
                    lng: myCircle.current.getCenter().lng(),
                };
                if (currentCenter.lat !== value.lat || currentCenter.lng !== value.lng) {
                    myCircle.current.setCenter(value);
                }
            }
        }
    }, [value]);

    // update radius
    useEffect(() => {
        if (myCircle.current && radius) {
            if (radius !== currentRadius) {
                myCircle.current.setRadius(radius);
            }
        }
    }, [radius, currentRadius]);

    const handleRadiusChange = () => {
        if (myCircle.current) {
            const r = Math.min(myCircle.current.getRadius(), 1000000);
            setRadius(r);

            if (onRadiusChange) {
                onRadiusChange(r);
            }
        }
    };

    const handleLocationChange = () => {
        if (myCircle.current) {
            const data = {
                lat: myCircle.current.getCenter().lat(),
                lng: myCircle.current.getCenter().lng(),
            };

            if (onCoordinatesChange) {
                onCoordinatesChange(data);
            }
        }
    };

    const getZoomLevel = (radius) => {
        if (radius === 0) {
            return 10;
        }
        const scale = radius / (zoomScaler || (largeScale ? 800 : 500));
        const zoomLevel = 15 - Math.log(scale) / Math.log(2);
        return parseInt(zoomLevel, 10);
    };

    return (
        <GoogleMap
            onLoad={(m) => {
                map.current = m;
                if (bounds) {
                    const setBounds = new window.google.maps.LatLngBounds(
                        { lat: bounds.minLat, lng: bounds.minLng },
                        { lat: bounds.maxLat, lng: bounds.maxLng }
                    );
                    map.current.fitBounds(setBounds);
                }
                if (offsetCenter) {
                    map.current.panBy(-200, 0);
                }
            }}
            center={defaultCenter || value || marker.position}
            zoom={getZoomLevel(radius)}
            options={{
                disableDefaultUI: true,
                backgroundColor: '#f6f8f9',
                zoomControl: editable,
                styles: [
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
                        featureType: 'road.arterial',
                        elementType: 'geometry',
                        stylers: [{ visibility: hideRoads ? 'off' : 'simplified' }],
                    },
                    ...(!hideNames ? textStyles : []),
                ],
                ...mapOptions,
            }}
            {...props}
        >
            {noCircle ? null : (
                <Circle
                    onLoad={(c) => (myCircle.current = c)}
                    options={{
                        fillColor: color || '#25F4D2',
                        strokeWeight: 0,
                        suppressUndo: true,
                    }}
                    editable={editable}
                    center={
                        myCircle.current ? myCircle.current.getCenter() : value || defaultCenter
                    }
                    radius={radius}
                    onCenterChanged={handleLocationChange}
                    onRadiusChanged={handleRadiusChange}
                />
            )}
        </GoogleMap>
    );
};

const Wrapper = (props) => {
    return <div style={{ height: '100%' }}>{props.children}</div>;
};

const libraries = ['geometry', 'places', 'visualization'];
const MapLoader = ({ ...props }) => {
    const { isLoaded } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ',
        libraries,
    });
    if (!isLoaded) {
        return (
            <Wrapper style={{ height: props.height || '500px' }}>
                <div style={{ height: '100%' }} />
            </Wrapper>
        );
    }

    return (
        <Wrapper style={{ height: props.height || '500px' }}>
            <SimpleMap mapContainerStyle={{ height: props.height || '500px' }} {...props} />
        </Wrapper>
    );
};

const textStyles = [
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
