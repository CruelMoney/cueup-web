import React from 'react';
import { Mutation, useLazyQuery } from 'react-apollo';
import { useHistory } from 'react-router';
import { SettingsSection, Input } from 'components/FormComponents';
import useTranslate from 'components/hooks/useTranslate';
import PasswordChanger from 'routes/User/components/PasswordChanger';
import TaxIdInput from 'components/TaxID';
import { DELETE_USER, MANAGE_SUBSCRIPTION } from '../../gql';

const SystemSection = ({ user, saveData }) => {
    const { translate } = useTranslate();
    const history = useHistory();

    const { appMetadata } = user || {};
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
                        const confirmed = window.confirm(
                            translate('user:preferences.delete-warning')
                        );
                        if (!confirmed) {
                            return;
                        }
                        deleteUser();
                    };

                    return (
                        <Input
                            half
                            type="button"
                            label="Delete user"
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
            <Input
                labelStyle={{ opacity: isPro ? 1 : 0.5 }}
                type="button"
                onClick={redirectToManageSubscription}
                loading={loading}
                label="Manage subscription"
                buttonText={'Go to subscription'}
                description="Download invoices and change or cancel your subscription."
                disabled={!isPro}
            />
            <TaxIdInput
                label="Tax ID"
                type="text"
                onSave={({ taxId, taxType }) => saveData({ taxId: taxId.trim(), taxType })}
                disabled={!isPro}
            />
        </SettingsSection>
    );
};

export default SystemSection;
