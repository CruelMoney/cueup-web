import React, { useState } from 'react';
import { useMutation, useQuery } from 'react-apollo';
import { Title, BodySmall } from 'components/Text';
import { Input, InputRow } from 'components/FormComponents';
import { SmartButton, Row, TeritaryButton, LoadingIndicator } from 'components/Blocks';
import { useForm } from 'components/hooks/useForm';
import { ME } from 'components/gql';
import useTranslate from 'components/hooks/useTranslate';
import { PAYMENT_PROVIDERS, PAYOUT_TYPES } from '../../../constants/constants';
import ErrorMessageApollo, { getErrorMessage } from '../ErrorMessageApollo';
import PhoneInput from '../PhoneInput';
import { UPDATE_USER_PAYOUT, USER_PAYOUT_METHOD, REMOVE_PAYOUT_METHOD } from './gql';

const PayoutForm = ({ loading, onSubmitted, translate, ...props }) => {
    const [mutate, { loading: submitting, error }] = useMutation(UPDATE_USER_PAYOUT, {
        onCompleted: onSubmitted,
        refetchQueries: [{ query: ME }],
        awaitRefetchQueries: true,
    });
    const [localError, setLocalError] = useState();
    const submit = async (values) => {
        setLocalError(null);
        try {
            mutate({
                variables: {
                    data: values,
                    provider: PAYMENT_PROVIDERS.DIRECT,
                    type: PAYOUT_TYPES.DIRECT,
                },
            });
        } catch (error) {
            const message = getErrorMessage(error);
            setLocalError(message);
        }
    };

    if (loading) {
        return (
            <div style={{ height: 200, justifyContent: 'center' }}>
                <LoadingIndicator label={'Loading information'} />
            </div>
        );
    }

    return (
        <>
            <MainForm submit={submit} {...props} loading={submitting} translate={translate} />
            <ErrorMessageApollo error={error || localError} />

            <div className="row center">
                <div className="col-xs-10">
                    <p
                        className="terms_link text-center"
                        dangerouslySetInnerHTML={{ __html: translate('payout.terms') }}
                    />
                </div>
            </div>
        </>
    );
};

const MainForm = ({ user, direct = {}, translate, isUpdate, submit, onCancel, loading }) => {
    const { userMetadata } = user;
    const { phone } = userMetadata || {};

    const [remove, { loading: removing }] = useMutation(REMOVE_PAYOUT_METHOD, {
        variables: { id: direct?.id },
        onCompleted: onCancel,
        refetchQueries: [{ query: ME }],
        awaitRefetchQueries: true,
    });
    const [form, setForm] = useState({
        phone,
        description: direct?.description,
    });
    const { registerValidation, unregisterValidation, runValidations } = useForm(form);

    const setValue = (key) => (value) => setForm((f) => ({ ...f, [key]: value }));

    const handleSubmit = () => {
        const errors = runValidations();
        if (!errors.length) {
            submit(form);
        }
    };

    return (
        <>
            <InputRow style={{ marginTop: '24px' }}>
                <PhoneInput
                    half
                    label={translate('Phone')}
                    defaultValue={form.phone}
                    name="phone"
                    validation={(v) => (v ? null : 'Please enter phone number')}
                    placeholder={translate('Phone')}
                    onSave={setValue('phone')}
                />

                <Input
                    type="text-area"
                    name="direct-description"
                    defaultValue={form.description}
                    label={'Description'}
                    placeholder={'Cash at event etc...'}
                    onSave={setValue('description')}
                    validation={(v) => (v ? null : 'Please enter description')}
                    registerValidation={registerValidation('description')}
                    unregisterValidation={unregisterValidation('description')}
                    style={{
                        height: '100px',
                    }}
                />
            </InputRow>
            <Row right>
                <TeritaryButton onClick={onCancel}>{translate('back')}</TeritaryButton>
                {isUpdate && (
                    <SmartButton
                        level="secondary"
                        warning="Are you sure you want to remove the payout method?"
                        loading={removing}
                        onClick={remove}
                    >
                        {translate('Remove')}
                    </SmartButton>
                )}
                <SmartButton loading={loading} type="submit" onClick={handleSubmit}>
                    {isUpdate ? translate('Update') : translate('Save')}
                </SmartButton>
            </Row>
        </>
    );
};

const DirectPayout = (props) => {
    const { translate } = useTranslate();
    const { loading, data } = useQuery(USER_PAYOUT_METHOD, {
        variables: { id: props.id },
        ssr: false,
        skip: !props.id,
    });

    const direct = data?.payoutMethod;

    return (
        <div className="payout-form">
            <Title>{translate('Direct Payout')}</Title>
            <BodySmall>{translate('payout.description-direct')}</BodySmall>

            <PayoutForm
                {...props}
                translate={translate}
                isUpdate={props.id}
                loading={loading}
                direct={direct}
            />
        </div>
    );
};

export default DirectPayout;
