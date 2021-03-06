import React from 'react';
import { useLazyQuery } from '@apollo/client';
import { Mutation } from '@apollo/client/react/components';
import { useHistory } from 'react-router';
import { SettingsSection, Input } from 'components/FormComponents';
import useTranslate from 'components/hooks/useTranslate';
import TaxIdInput from 'components/TaxID';
import { DELETE_USER, MANAGE_SUBSCRIPTION } from './gql';
import PasswordChanger from './components/PasswordChanger';

const SystemSection = ({ user, saveData }) => {
    const { translate } = useTranslate();
    const history = useHistory();

    const { appMetadata, isDj } = user || {};
    const isPro = appMetadata?.isPro;

    const [getManageSubscriptionSessionUrl, { loading }] = useLazyQuery(MANAGE_SUBSCRIPTION, {
        onCompleted: ({ manageSubscription }) => {
            window.location.href = manageSubscription;
        },
    });

    const redirectToManageSubscription = () => {
        getManageSubscriptionSessionUrl({
            variables: {
                redirectUrl: window.location.href,
            },
        });
    };

    return (
        <SettingsSection
            id="system"
            title={'System'}
            description={'Deleting your user is irreversible.'}
            noBorder
            stickyTop={'15px'}
        >
            <Mutation
                mutation={DELETE_USER}
                variables={{
                    id: user.id,
                }}
                onCompleted={() => {
                    history.push('/');
                }}
            >
                {(deleteUser) => {
                    const doMutate = () => {
                        const confirmed = window.confirm('This cannot be undone.');
                        if (!confirmed) {
                            return;
                        }
                        deleteUser();
                    };

                    return (
                        <Input
                            half
                            type="button"
                            label="Delete profile"
                            warning={true}
                            onClick={() => doMutate()}
                            buttonText="Delete"
                        />
                    );
                }}
            </Mutation>
            <Input
                half
                type="button"
                label="Export all data"
                buttonText="Export"
                onClick={(_) => window.alert("We'll send you an email when your data is ready.")}
            />
            <PasswordChanger half onSave={saveData} />
            {isDj && (
                <Input
                    proFeature
                    isPro={isPro}
                    style={{ opacity: isPro ? 1 : 0.5 }}
                    type="button"
                    onClick={redirectToManageSubscription}
                    loading={loading}
                    label="Manage subscription"
                    buttonText={'Go to subscription'}
                    description="Download invoices, change payment method or cancel your subscription."
                    disabled={!isPro}
                />
            )}
            {isDj && (
                <TaxIdInput
                    proFeature
                    isPro={isPro}
                    label="Tax ID"
                    type="text"
                    onSave={({ taxId, taxType }) => saveData({ taxId: taxId.trim(), taxType })}
                    disabled={!isPro}
                />
            )}
        </SettingsSection>
    );
};

export default SystemSection;
