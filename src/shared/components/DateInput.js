import React, { useState } from 'react';
import { Input } from './FormComponents';

// a regex that matches all strings when writing a date on the format MM-YYYY
const regx = /^((0{1}[1-9]?)|(1{1}[0-2]?))((-(\d?\d?\d?\d?))?)$/;

const formatToDate = (value) => {
    if (!value) {
        return null;
    }
    // create real date from value
    const [month, year] = value.split('-');

    if (month && year) {
        const d = Date.UTC(year, parseInt(month - 1));
        return new Date(d);
    }
    return null;
};

const dateToFormat = (d) => {
    if (!d) {
        return null;
    }
    const date = new Date(d);

    if (!isNaN(date)) {
        return `${date.getUTCMonth() + 1}-${date.getUTCFullYear()}`.padStart(7, '0');
    }
    return null;
};

const DateInput = ({ onSave, defaultValue, ...props }) => {
    const [value, setValue] = useState(dateToFormat(defaultValue));

    const handleSave = () => {
        const d = formatToDate(value);

        onSave(d);
    };

    const maskDate = (v) => {
        let val = String(v);

        if (val.length < value?.length) {
            setValue(val);
            return;
        }

        if (val.length === 2) {
            val += '-';
        }
        if (regx.test(val)) {
            setValue(val);
        }
    };

    const handleChange = (v) => {
        maskDate(v);
    };

    return (
        <Input
            placeholder="MM-YYYY"
            {...props}
            onChange={handleChange}
            onSave={handleSave}
            value={value}
        />
    );
};

export default DateInput;
