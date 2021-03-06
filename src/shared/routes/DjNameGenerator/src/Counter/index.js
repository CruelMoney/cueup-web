import React, { useRef } from 'react';
import { useSubscription, useQuery } from '@apollo/client';
import throttle from 'react-throttle-render';
import { COUNT_UPDATED_SUB, GET_GENERATED_NAMES_COUNT } from '../gql';

const Counter = ({ count }) => {
    return (
        <p className="counter">
            <span>{count.toLocaleString()}</span> DJ names generated
        </p>
    );
};

const DebouncedCounter = throttle(500)(Counter);

const DataWrapper = () => {
    const { data: countData } = useQuery(GET_GENERATED_NAMES_COUNT, { ssr: false });

    const { data } = useSubscription(COUNT_UPDATED_SUB);

    const count = data?.countUpdated || countData?.getGeneratedNamesCount;

    if (!count) {
        return (
            <p className="counter">
                <span>.....</span> DJ names generated
            </p>
        );
    }

    return <DebouncedCounter count={count} />;
};

export default DataWrapper;
