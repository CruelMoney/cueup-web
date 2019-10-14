import React from 'react';
import constants from '../constants/constants';
import SuggestionList from './SuggestionList';

const CurrencySelector = ({ initialValue, ...props }) => {
    return (
        <SuggestionList
            {...props}
            disableInput
            defaultValue={initialValue || ''}
            suggestions={constants.Currencies}
        />
    );
};

export default CurrencySelector;
