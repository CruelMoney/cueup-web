import React, { useState } from 'react';
import { Checkbox } from './FormComponents';
import { Col } from './Blocks';

const CheckBoxRow = ({ label, onChange, small, defaultValue }) => {
    return (
        <div
            style={{ minHeight: '42px', display: 'flex', alignItems: 'center', paddingBottom: 12 }}
        >
            <Checkbox
                defaultValue={defaultValue}
                onChange={(val) => onChange(val)}
                label={label}
                small={small}
            />
        </div>
    );
};

const rows = {
    speakers: {
        label: 'Include speakers',
    },
    lights: {
        label: 'Include party lights',
    },
    microphone: {
        label: 'Include a microphone',
    },
};

const RiderOptions = ({ onSave, initialValues }) => {
    const [internal, setInternal] = useState(initialValues || {});

    const onChange = (key) => (val) => {
        const newRows = {
            ...internal,
            [key]: val,
        };
        setInternal(newRows);
        onSave(newRows);
    };

    return (
        <div style={{ width: '100%', columnCount: 2 }}>
            {Object.entries(rows).map(([key, { label }]) => {
                return (
                    <CheckBoxRow
                        small
                        defaultValue={internal[key]}
                        key={key}
                        label={label}
                        onChange={onChange(key)}
                    />
                );
            })}
        </div>
    );
};

export default RiderOptions;
