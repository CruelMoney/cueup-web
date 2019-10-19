import React, { useState } from 'react';
import styled from 'styled-components';
import { Label, Value, Checkbox } from './FormComponents';
import { Row, Col, Hr, inputStyle } from './Blocks';

const TableRow = styled(Row)`
    height: 42px;
    align-items: center;
    p {
        margin: 0;
    }
    > *:first-child {
        flex: 1;
    }
    > *:nth-child(2),
    > *:nth-child(3) {
        min-width: 100px;
        text-align: center;
    }
`;

const OtherInput = styled.input`
    ${inputStyle}
    font-size: 18px;
    color: #122b48;
    margin: 0;
`;

const CheckBoxRow = ({ label, checked, onChange }) => {
    return (
        <TableRow>
            <Value>{label}</Value>
            <Checkbox defaultValue={checked} onChange={onChange} withBorder />
        </TableRow>
    );
};

const OtherRow = ({ checked, onChange, onTextChange }) => {
    return (
        <TableRow>
            {checked ? (
                <OtherInput autoFocus type="text" onChange={(e) => onTextChange(e.target.value)} />
            ) : (
                <Value>Other</Value>
            )}
            <Checkbox
                defaultValue={checked}
                onChange={(val) => onChange(val ? 'other' : val)}
                withBorder
            />
        </TableRow>
    );
};

const CheckboxTable = ({ style, onSave, options, labels }) => {
    const [internal, setInternal] = useState({
        other: false,
    });
    const [otherReason, setOtherReason] = useState();

    const onTextChange = (v) => {
        setOtherReason(v);
        onSave && onSave(otherReason);
    };

    const onChange = (key) => (value) => {
        const newValues = {
            [key]: value,
        };

        setInternal(newValues);
        onSave && onSave(value);
    };

    return (
        <Col style={style}>
            {labels && (
                <>
                    <TableRow>
                        {labels.map((l) => (
                            <Label key={l}>{l}</Label>
                        ))}
                    </TableRow>
                    <Hr />
                </>
            )}
            <div key={JSON.stringify(internal)}>
                {Object.entries(options).map(([key, { label }]) => {
                    return (
                        <CheckBoxRow
                            key={key}
                            label={label}
                            checked={internal[key]}
                            onChange={(val) => onChange(key)(val ? label : val)}
                        />
                    );
                })}
                <OtherRow
                    checked={internal.other}
                    onChange={onChange('other')}
                    onTextChange={onTextChange}
                />
            </div>
        </Col>
    );
};

export default CheckboxTable;
