import React, { Component } from 'react';
import lodashMap from 'lodash/map';

class NumberedList extends Component {
    displayName = 'Form';

    render() {
        //Taking a list of react elements and see if they have defined to be only showed
        //When certain filters are true. If no showon are defined it shows always
        const getVisibleRegistrationElements = (elems, filters) => {
            if (filters === undefined) {
                return elems;
            }
            filters = lodashMap(filters, (value, key) => value);
            return elems.filter((elem) =>
                filters
                    .map(
                        (filter) =>
                            elem.props.hideOn === undefined || !elem.props.hideOn.includes(filter)
                    )
                    .reduce((pre, cur) => pre && cur, true)
            );
        };

        return (
            <ol>
                {getVisibleRegistrationElements(
                    this.props.children,
                    this.context.activeFilters
                ).map((result, idx) => {
                    if (!result) {
                        return null;
                    }
                    return <li key={result.props.name + '-' + idx}>{result}</li>;
                })}
            </ol>
        );
    }
}

export default NumberedList;
