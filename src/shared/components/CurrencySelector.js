import React from 'react';
import constants from '../constants/constants';
import SuggestionList from './SuggestionList';

const CurrencySelector = ({ defaultValue, initialValue, ...props }) => {
    return (
        <SuggestionList
            disableInput
            defaultValue={defaultValue || initialValue || ''}
            suggestions={constants.Currencies}
            {...props}
        />
    );
};

export default CurrencySelector;
