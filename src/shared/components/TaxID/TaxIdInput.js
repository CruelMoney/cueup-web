import React, { useRef, useState, useCallback } from 'react';
import { useQuery } from 'react-apollo';
import { Icon } from '@iconify/react';
import timeIcon from '@iconify/icons-ion/time';
import checkmarkIcon from '@iconify/icons-ion/checkmark-circle';
import { TextInput, Row, Col } from 'components/Blocks';
import { InputLabel, InputRow } from 'components/FormComponents';
import { SearchableSuggestionList } from 'components/SuggestionList/SuggestionList';
import { BodySmall } from 'components/Text';
import Tooltip from 'components/Tooltip';
import taxOptions from './options.json';
import { USER_TAX_ID } from './gql';

const DataWrapper = (props) => {
    const { data, loading } = useQuery(USER_TAX_ID, { ssr: false, fetchPolicy: 'network-only' });
    const taxId = data?.me?.userMetadata?.taxId;
    return <TaxIdInput loading={loading} key={data} data={taxId} {...props} />;
};

const TaxIdInput = ({ label, onSave, loading, onChange, onBlur, data, ...props }) => {
    const ref = useRef();
    const [selection, setSelection] = useState(data?.country);
    const [error, setError] = useState();

    const taxType = selection?.type;

    const validate = useCallback(
        (value) => {
            if (value && !taxType) {
                setError('Select a country');
                return true;
            }
            return null;
        },
        [taxType]
    );

    const save = (e) => {
        const value = e.target ? e.target.value : e;

        const error = validate(value);
        if (!error && value) {
            onSave && onSave({ taxId: value, taxType }, e);
        }
    };

    const change = (e) => {
        e.persist();
        onChange && onChange(e.target.value);
    };

    const handleBlur = (e) => {
        e.persist();
        save(e);
        onBlur && onBlur();
    };

    return (
        <InputLabel>
            {label}
            <Row style={{ position: 'relative' }}>
                <SearchableSuggestionList
                    disabled={loading}
                    half
                    forceHeight
                    error={error}
                    suggestions={taxOptions}
                    wrapperStyle={{ marginBottom: 0, marginRight: 6 }}
                    style={{ marginTop: 0 }}
                    defaultValue={selection}
                    placeholder="Country"
                    onSave={(val) => {
                        setError(null);
                        setSelection(val);
                    }}
                />
                <TextInput
                    disabled={loading}
                    save={save}
                    onChange={change}
                    placeholder={selection?.placeholder}
                    ref={ref}
                    onBlur={handleBlur}
                    defaultValue={data?.value}
                    {...props}
                />
                {data?.verification && <CurrentStatus {...data.verification} />}
            </Row>
            <BodySmall>Add a tax ID if you want to display it on invoices sent to you.</BodySmall>
        </InputLabel>
    );
};

const statusIcons = {
    verified: checkmarkIcon,
    pending: timeIcon,
};

const statusColors = {
    verified: '#1ea672',
    pending: null,
};

/* eslint-disable camelcase */
const StatusContent = ({ status, verified_name, verified_address }) => {
    if (status === 'verified') {
        return (
            <Col>
                <BodySmall style={{ color: statusColors.verified }}>
                    Valid tax ID registered to:
                </BodySmall>

                <BodySmall>{verified_name}</BodySmall>
                <BodySmall>{verified_address}</BodySmall>
            </Col>
        );
    }
    if (status === 'pending') {
        return (
            <Col>
                <BodySmall>Tax ID pending validation.</BodySmall>
            </Col>
        );
    }
};

const CurrentStatus = (verification) => {
    const { status } = verification;

    if (!['pending', 'verified'].includes(status)) {
        return null;
    }

    return (
        <Tooltip content={StatusContent(verification)}>
            {({ ref, close, open }) => (
                <div
                    style={{ position: 'absolute', right: 9, bottom: 4 }}
                    ref={ref}
                    onMouseEnter={open}
                    onMouseLeave={close}
                >
                    <Icon icon={statusIcons[status]} color={statusColors[status]} />
                </div>
            )}
        </Tooltip>
    );
};

export default DataWrapper;
