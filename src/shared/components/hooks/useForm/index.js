import { isArray } from 'util';
import { useState, useRef, useEffect, useCallback } from 'react';
import * as validators from './validators';

export const useValidation = ({ validation, registerValidation, unregisterValidation, ref }) => {
    const [error, setError] = useState(null);

    const runValidation = useCallback(
        (value, returnRef = true) => {
            if (validation) {
                let validationError = null;
                // handle if array, return first error
                if (isArray(validation)) {
                    validationError = validation.reduce((err, v) => err || v(value), false);
                } else {
                    // handle if single function
                    validationError = validation(value);
                }

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
            registerValidation(runValidation);
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

    const runValidations = (scrollToError) => {
        const refs = Object.entries(validations.current)
            .reduce((refs, [key, fun]) => [...refs, fun(form[key])], [])
            .filter((r) => !!r);

        if (scrollToError && refs[0]?.current) {
            console.log(refs[0].current.offsetTop);
            window.scrollTo({
                behavior: 'smooth',
                top: refs[0].current.offsetTop,
            });
        }

        return refs;
    };

    return {
        registerValidation,
        unregisterValidation,
        runValidations,
    };
};

export { validators };
