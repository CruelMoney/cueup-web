import React from 'react';
import { useSubscription, useQuery } from 'react-apollo';
import { COUNT_UPDATED_SUB, GET_GENERATED_NAMES_COUNT } from '../gql';

const Counter = () => {
    const { data: countData } = useQuery(GET_GENERATED_NAMES_COUNT);

    const { data } = useSubscription(COUNT_UPDATED_SUB);

    const count = data?.countUpdated || countData?.getGeneratedNamesCount;

    if (!count) {
        return null;
    }

    return (
        <p className="counter">
            <span>{count}</span> DJ names generated
        </p>
    );
};

export default Counter;
