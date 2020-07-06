import React from 'react';
import { Mutation } from 'react-apollo';
import { useHistory } from 'react-router';
import { SettingsSection, Input } from 'components/FormComponents';
import useTranslate from 'components/hooks/useTranslate';
import PasswordChanger from 'routes/User/components/PasswordChanger';
import { DELETE_USER } from '../../gql';

const SystemSection = ({ user, saveData }) => {
    const { translate } = useTranslate();
    const history = useHistory();

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
        </SettingsSection>
    );
};

export default SystemSection;
