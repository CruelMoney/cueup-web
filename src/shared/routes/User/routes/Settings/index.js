import React from 'react';
import { useServerContext } from 'components/hooks/useServerContext';
import BasicSection from './BasicSection';
import ProfileSection from './ProfileSection';
import PreferencesSection from './PreferencesSection';
import SystemSection from './SystemSection';

const hasChanges = (o1, o2) => {
    const keys = Object.keys(o1);
    return keys.some((key) => o2[key] !== o1[key]);
};

const Settings = ({ user, loading, updateUser, history, location }) => {
    const params = new URLSearchParams(location.search);
    const modal = params.get('modal');

    const { environment } = useServerContext();

    const onModalClose = () => {
        history.replace(location.pathname);
    };

    const saveData = async (data) => {
        const flatUser = {
            ...user,
            ...user.userMetadata,
        };
        if (hasChanges(data, flatUser)) {
            await updateUser({
                variables: {
                    id: user.id,
                    redirectLink: environment.CALLBACK_DOMAIN,
                    ...data,
                },
            });
        }
    };

    const updateKey = (key) => async (value) => {
        await updateUser({
            variables: {
                id: user.id,
                [key]: value,
            },
        });
    };

    if (loading) {
        return null;
    }
    const { isDj } = user;

    return (
        <>
            <BasicSection
                user={user}
                updateKey={updateKey}
                saveData={saveData}
                modal={modal}
                onModalClose={onModalClose}
            />

            {isDj && (
                <ProfileSection
                    user={user}
                    updateKey={updateKey}
                    saveData={saveData}
                    modal={modal}
                    onModalClose={onModalClose}
                />
            )}

            <PreferencesSection
                user={user}
                updateKey={updateKey}
                saveData={saveData}
                modal={modal}
                onModalClose={onModalClose}
            />

            <SystemSection
                user={user}
                updateKey={updateKey}
                saveData={saveData}
                modal={modal}
                onModalClose={onModalClose}
            />
        </>
    );
};

export default Settings;
