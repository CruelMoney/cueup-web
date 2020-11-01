import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Redirect } from 'react-router-dom';
import { useMutation, useQuery } from '@apollo/client';
import { useHistory, useLocation } from 'react-router';
import { useServerContext } from 'components/hooks/useServerContext';
import SavingIndicator from 'components/SavingIndicator';
import { Container, Hr } from 'components/Blocks';
import Menu from 'components/Navigation';
import Footer from 'components/common/Footer';
import { LoadingPlaceholder2 } from 'components/common/LoadingPlaceholder';
import BasicSection from './BasicSection';
import ProfileSection from './ProfileSection';
import PreferencesSection from './PreferencesSection';
import SystemSection from './SystemSection';
import ProSection from './ProSection';
import SocialProfiles from './SocialProfiles';
import { UPDATE_USER, ME_SETTINGS } from './gql';

const hasChanges = (o1, o2) => {
    const keys = Object.keys(o1);
    return keys.some((key) => o2[key] !== o1[key]);
};

const Settings = ({ user, loading, updateUser }) => {
    const location = useLocation();
    const history = useHistory();

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

    if (loading || !user) {
        return <LoadingPlaceholder2 />;
    }
    const { isDj } = user;

    const isPro = user?.appMetadata?.isPro;

    return (
        <>
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

const DataWrapper = () => {
    const { data, loading } = useQuery(ME_SETTINGS);
    const [updateUser, { loading: isSaving, error: updateError }] = useMutation(UPDATE_USER);

    const me = data?.me;

    if (me && !me.appMetadata.onboarded) {
        return <Redirect to={'/complete-signup'} />;
    }

    const metaTitle = 'Settings · Cueup';

    return (
        <>
            <Helmet>
                <title>{metaTitle}</title>
                <meta property="og:title" content={metaTitle} />
                <meta name="twitter:title" content={metaTitle} />
                <meta name="robots" content="noindex" />
            </Helmet>
            <Menu dark relative />
            <Container style={{ minHeight: '80vh' }}>
                <Hr style={{ marginBottom: 30 }} />
                <Settings user={me} loading={loading} updateUser={updateUser} />
                <SavingIndicator loading={isSaving} error={updateError} />
            </Container>
            <Footer noPreFooter />
        </>
    );
};

export default DataWrapper;
