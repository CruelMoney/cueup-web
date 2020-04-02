import React from 'react';
import { getData } from 'country-list';
import { Query } from 'react-apollo';
import { SearchableSuggestionList } from 'components/SuggestionList/SuggestionList';
import { AVAILABLE_BANKS } from './PayoutForm/gql';

const countries = getData().map(({ code, name }) => ({ label: name, value: code }));
const CountrySelector = (props) => {
    return <SearchableSuggestionList name="country-selector" {...props} suggestions={countries} />;
};

export default CountrySelector;

export const BankSelector = ({ placeholder, ...props }) => {
    return (
        <Query query={AVAILABLE_BANKS} variables={{ countryCode: 'ID' }} ssr={false}>
            {({ loading, data }) => {
                let options = [];
                if (data && data.availableBanks) {
                    options = data.availableBanks.map(({ code, name }) => ({
                        label: name,
                        value: code,
                    }));
                }

                return (
                    <SearchableSuggestionList
                        {...props}
                        suggestions={options}
                        disabled={loading}
                        placeholder={loading ? 'Loading' : placeholder}
                    />
                );
            }}
        </Query>
    );
};
