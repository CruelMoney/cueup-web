import React, { useState, useEffect, useRef } from 'react';
import useScript from '@charlietango/use-script';
import SuggestionList from '../SuggestionList';

function toTitleCase(str) {
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const LocationSelector = ({ placeholder, ...props }) => {
    const [dataSource, setDataSource] = useState([]);
    const locationService = useRef();

    const [loaded] = useScript(
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
    );

    useEffect(() => {
        if (loaded && !locationService.current) {
            locationService.current = new window.google.maps.places.AutocompleteService();
        }
    }, [loaded]);

    if (!loaded) {
        return <SuggestionList {...props} disabled placeholder="loading" />;
    }

    const updateSuggestions = (predictions, status) => {
        const li = [];

        if (predictions) {
            predictions.forEach((prediction) => {
                li.push(prediction.description);
            });
        }

        setDataSource(li);
    };

    const onChangeHandler = (v) => {
        const value = toTitleCase(v);

        if (value && value.trim()) {
            locationService.current.getPlacePredictions(
                {
                    input: value,
                    //  types: ['(regions)'],
                    componentRestrictions: { country: ['dk', 'id', 'us'] },
                },
                updateSuggestions
            );
        } else {
            setDataSource([]);
        }
    };

    return (
        <SuggestionList
            onChange={onChangeHandler}
            placeholder={placeholder || 'City'}
            suggestions={dataSource}
            {...props}
        />
    );
};

export default LocationSelector;
