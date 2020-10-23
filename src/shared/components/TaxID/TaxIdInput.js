import React, { useRef, useState, useCallback } from 'react';
import { useQuery } from '@apollo/client';
import { Icon } from '@iconify/react';
import timeIcon from '@iconify/icons-ion/time';
import checkmarkIcon from '@iconify/icons-ion/checkmark-circle';
import styled from 'styled-components';
import { TextInput, Row, Col } from 'components/Blocks';
import { InputLabel, InputRow, ProFeature, LabelHalf, Label } from 'components/FormComponents';
import { SearchableSuggestionList } from 'components/SuggestionList/SuggestionList';
import { BodySmall } from 'components/Text';
import Tooltip from 'components/Tooltip';
import taxOptions from './options.json';
import { USER_TAX_ID } from './gql';

const DataWrapper = (props) => {
    const { data, loading, refetch } = useQuery(USER_TAX_ID, { ssr: false });
    const taxId = data?.me?.userMetadata?.taxId;
    return <TaxIdInput loading={loading} key={data} data={taxId} refetch={refetch} {...props} />;
};

const TaxIdInput = ({
    label,
    refetch,
    onSave,
    loading,
    onChange,
    onBlur,
    data,
    disabled,
    isPro,
    ...props
}) => {
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

    const save = async (e) => {
        const value = e.target ? e.target.value : e;

        const error = validate(value);
        if (!error && value) {
            onSave && (await onSave({ taxId: value, taxType }, e));
            refetch();
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
        <>
            <Label>
                {label}
                <ProFeature small disabled={isPro} />
            </Label>
            <CombineInputRow>
                <LabelHalf>
                    <SearchableSuggestionList
                        disabled={loading || disabled}
                        half
                        forceHeight
                        error={error}
                        suggestions={taxOptions}
                        wrapperStyle={{ marginBottom: 0, width: '100%' }}
                        style={{ marginTop: 0 }}
                        defaultValue={selection}
                        placeholder="Country"
                        onSave={(val) => {
                            setError(null);
                            setSelection(val);
                        }}
                    />
                </LabelHalf>
                <LabelHalf>
                    <TextInput
                        disabled={loading || disabled}
                        save={save}
                        onChange={change}
                        placeholder={selection?.placeholder}
                        ref={ref}
                        onBlur={handleBlur}
                        defaultValue={data?.value}
                        {...props}
                    />
                </LabelHalf>
                {data?.verification && <CurrentStatus {...data.verification} />}
            </CombineInputRow>
            <BodySmall>Add your tax ID on the invoices sent to you.</BodySmall>
        </>
    );
};

const CombineInputRow = styled(InputRow)`
    display: flex;
    width: 100%;
    position: relative;
    ${LabelHalf} {
        margin-bottom: 6px;
    }
    > :first-child {
        margin-right: 6px;
    }
`;

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
                    style={{ position: 'absolute', right: 45, bottom: 13 }}
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
