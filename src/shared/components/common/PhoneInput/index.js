import React, { useEffect, useRef } from 'react';
import { Input } from '../../FormComponents';

const PhoneInput = ({ ...props }) => {
    const valid = useRef(() => null);

    useEffect(() => {
        import('./validator').then(({ validator }) => {
            valid.current = validator;
        });
    }, []);

    return <Input {...props} type="tel" validation={valid.current} />;
};

export default PhoneInput;
