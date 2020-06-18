import React, { useState, useRef, useEffect, useCallback } from 'react';
import { useMutation } from 'react-apollo';

import { Checkbox } from '../../../../components/FormComponents';
import { Title, Body } from '../../../../components/Text';
import { Row, TeritaryButton, SmartButton } from '../../../../components/Blocks';
import ErrorMessageApollo from '../../../../components/common/ErrorMessageApollo';

import { USER_SOUNDS, DELETE_SOUND } from './gql';

const RemoveSound = ({ sound = {}, onCancel, closeModal, userId }) => {
    const { source } = sound;
    const isSoundcloud = source === 'soundcloud';
    const isMixcloud = source === 'mixcloud';
    const isCueup = source === null;

    const [form, setForm] = useState({
        removeOnSoundCloud: true,
        removeOnMixcloud: true,
        ...sound,
    });

    const onChange = (key) => (val) => {
        setForm((form) => ({ ...form, [key]: val }));
    };

    const [deleteSound, { loading, error }] = useMutation(DELETE_SOUND, {
        variables: form,
        refetchQueries: [{ query: USER_SOUNDS, variables: { userId } }],
        awaitRefetchQueries: true,
        onCompleted: closeModal,
    });

    return (
        <div>
            <Title>Remove sound</Title>
            {isCueup && <Body>This will remove the sound from Cueup, and cannot be undone.</Body>}
            {isSoundcloud && (
                <Body>
                    This will remove the sound from Soundcloud and Cueup. This cannot be undone.
                </Body>
            )}
            {isMixcloud && (
                <Body>
                    This will remove the sound from Mixcloud and Cueup. This cannot be undone.
                </Body>
            )}
            <div style={{ marginTop: '24px' }}>
                {sound.soundcloudId && (
                    <Checkbox
                        label="Remove from your Soundcloud"
                        defaultValue={form.removeOnSoundCloud}
                        onChange={onChange('removeOnSoundCloud')}
                    />
                )}
                {sound.mixcloudId && (
                    <Checkbox
                        label="Remove from your mixcloud"
                        defaultValue={form.removeOnMixcloud}
                        onChange={onChange('removeOnMixcloud')}
                    />
                )}
            </div>
            <Row right style={{ marginTop: 24 }}>
                <TeritaryButton type="button" onClick={onCancel}>
                    Cancel
                </TeritaryButton>
                <SmartButton warning loading={loading} onClick={deleteSound}>
                    Remove
                </SmartButton>
            </Row>
            <ErrorMessageApollo error={error} />
        </div>
    );
};

export default RemoveSound;
