import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useServerContext } from 'components/hooks/useServerContext';
import BasicSection from './BasicSection';
import ProfileSection from './ProfileSection';
import PreferencesSection from './PreferencesSection';
import SystemSection from './SystemSection';
import ProSection from './ProSection';
import SocialProfiles from './SocialProfiles';

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

    const isPro = user?.appMetadata?.isPro;

    const metaTitle = `${user.title} · Settings · Cueup`;

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="robots" content="noindex" />
            </Helmet>
            {!isPro && isDj && <ProSection user={user} updateKey={updateKey} saveData={saveData} />}
            {isDj && (
                <ProfileSection
                    user={user}
                    updateKey={updateKey}
                    saveData={saveData}
                    modal={modal}
                    onModalClose={onModalClose}
                />
            )}
            <BasicSection
                user={user}
                updateKey={updateKey}
                saveData={saveData}
                modal={modal}
                onModalClose={onModalClose}
            />

            <SocialProfiles
                user={user}
                updateKey={updateKey}
                saveData={saveData}
                modal={modal}
                onModalClose={onModalClose}
            />

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
