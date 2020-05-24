import React, { useState, useEffect, useRef } from 'react';
import useScript from '@charlietango/use-script';
import SuggestionList from '../SuggestionList';
import poweredByGoogle from '../../assets/powered_by_google.png';

function toTitleCase(str) {
    if (!str) {
        return str;
    }
    return str.replace(/\w\S*/g, (txt) => {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

const LocationSelector = ({ placeholder, countries = [], ...props }) => {
    const [dataSource, setDataSource] = useState([]);
    const [focus, setFocus] = useState(false);
    const locationService = useRef();

    // we only want to load when starting search
    const [scriptUrl, setScriptUrl] = useState();
    const [loaded] = useScript(scriptUrl);
    const startLoadingScript = () => {
        setScriptUrl(
            'https://maps.googleapis.com/maps/api/js?key=AIzaSyAQNiY4yM2E0h4SfSTw3khcr9KYS0BgVgQ&libraries=geometry,places,visualization,geocode'
        );
    };

    useEffect(() => {
        if (loaded && !locationService.current) {
            locationService.current = new window.google.maps.places.AutocompleteService();
        }
    }, [loaded]);

    const updateSuggestions = (predictions, _status) => {
        const li = [];

        if (predictions) {
            predictions.forEach((prediction) => {
                li.push(prediction.description);
            });
        }

        setDataSource(li);
    };

    const onChangeHandler = (v) => {
        if (!scriptUrl) {
            startLoadingScript();
        }

        const value = toTitleCase(v);

        if (value && value.trim() && locationService.current) {
            locationService.current.getPlacePredictions(
                {
                    input: value,
                    //  types: ['(regions)'],
                    componentRestrictions: { country: countries },
                },
                updateSuggestions
            );
        } else {
            setDataSource([]);
        }
    };

    return (
        <>
            <SuggestionList
                onChange={onChangeHandler}
                placeholder={placeholder || 'City'}
                suggestions={dataSource}
                onFocus={() => setFocus(true)}
                onBlur={() => setFocus(false)}
                disableInput={false}
                {...props}
            />
            {focus && (
                <div
                    style={{
                        position: 'absolute',
                        top: '40px',
                        right: '15px',
                        pointerEvents: 'none',
                        zIndex: 2,
                    }}
                >
                    <img style={{ width: '96px' }} src={poweredByGoogle} alt="powered by google" />
                </div>
            )}
        </>
    );
};

export default LocationSelector;
