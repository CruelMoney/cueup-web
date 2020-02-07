import React from 'react';
import { SearchableSuggestionList } from 'components/SuggestionList/SuggestionList';
import { Input } from 'components/FormComponents.js';
import US from './US.json';
import AUS from './AUS.json';

const StateSelector = ({ countryCode, ...props }) => {
    let sugggestions = [];

    if (countryCode === 'US') {
        sugggestions = Object.entries(US).map(([value, label]) => ({ label, value }));
    }

    if (countryCode === 'AU') {
        sugggestions = AUS.map(({ name, abbreviation }) => ({ label: name, value: abbreviation }));
    }

    if (!sugggestions.length) {
        return <Input {...props} />;
    }
    return <SearchableSuggestionList {...props} suggestions={sugggestions} />;
};

export default StateSelector;
