import { captureException } from '@sentry/core';
import { useHistory, useLocation } from 'react-router';
import { useState, useEffect } from 'react';
import useDebounce from './useDebounce';

const formToParams = (form) => {
    try {
        const searchParams = new URLSearchParams(window.location.search);
        Object.keys(form).forEach((key) => {
            const value = form[key];
            if (value) {
                searchParams.set(key, JSON.stringify(value));
            }
        });
        return searchParams;
    } catch (error) {
        console.log({ error });
        return '';
    }
};

const paramsToForm = (params) => {
    const form = {};

    try {
        const searchParams = new URLSearchParams(params);

        searchParams.forEach((val, key) => {
            try {
                const value = JSON.parse(val);

                if (key === 'date') {
                    form[key] = new Date(value);
                } else {
                    form[key] = value;
                }
            } catch (error) {}
        });
    } catch (error) {
        captureException(error);
    }
    return form;
};

const useUrlState = (initialState) => {
    const history = useHistory();
    const location = useLocation();
    // initialize state with url + initialstate
    const [state, setState] = useState({ ...initialState, ...paramsToForm(location.search) });

    // save state to url
    const debouncedState = useDebounce(state, 500);
    useEffect(() => {
        if (debouncedState) {
            const searchParams = formToParams(debouncedState);
            history.replace(`?${searchParams.toString()}`);
        }
    }, [debouncedState, history]);

    return [state, setState];
};

export default useUrlState;
