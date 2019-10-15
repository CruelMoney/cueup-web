import { useState, useRef, useEffect, useCallback } from 'react';
import * as validators from './validators';

export const useValidation = ({ validation, registerValidation, unregisterValidation, ref }) => {
    const [error, setError] = useState(null);

    const runValidation = useCallback(
        (value, returnRef) => {
            if (validation) {
                const validationError = validation(value);
                if (validationError) {
                    setError(validationError);
                    return returnRef ? ref : validationError;
                }
                setError(null);
                return null;
            }
        },
        [validation, ref]
    );

    useEffect(() => {
        if (registerValidation) {
            registerValidation((val) => runValidation(val, true));
        }
        if (unregisterValidation) {
            return () => unregisterValidation(runValidation);
        }
    }, [validation, registerValidation, unregisterValidation, runValidation]);
    return {
        runValidation,
        error,
    };
};

export const useForm = (form) => {
    const validations = useRef({});
    const registerValidation = (key) => (fun) => {
        validations.current = {
            ...validations.current,
            [key]: fun,
        };
    };

    const unregisterValidation = (key) => (fun) => {
        delete validations.current[key];
    };

    const runValidations = () => {
        console.log({ validations });

        return Object.entries(validations.current)
            .reduce((refs, [key, fun]) => [...refs, fun(form[key])], [])
            .filter((r) => !!r);
    };

    return {
        registerValidation,
        unregisterValidation,
        runValidations,
    };
};

export { validators };
