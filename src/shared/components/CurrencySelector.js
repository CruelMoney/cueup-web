import React from 'react';
import constants from '../constants/constants';
import SuggestionList from './SuggestionList';

const CurrencySelector = ({ defaultValue, initialValue, ...props }) => {
    return (
        <SuggestionList
            {...props}
            disableInput
            defaultValue={defaultValue || initialValue || ''}
            suggestions={constants.Currencies}
        />
    );
};

export default CurrencySelector;
