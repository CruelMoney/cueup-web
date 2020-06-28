import React from 'react';
import { NavLink, useRouteMatch, Route, useLocation } from 'react-router-dom';
import { useLazyQuery } from 'react-apollo';
import { SettingsSection, Input } from 'components/FormComponents';
import { PrimaryButton } from 'components/Blocks';
import { MANAGE_SUBSCRIPTION } from 'routes/User/gql';

const ProSection = () => {
    const match = useRouteMatch();

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
        <SettingsSection id="pro" title={'Cueup Pro'} description={''}>
            <Input
                label="Website"
                // defaultValue={artistName}
                placeholder={'https://artistname.com'}
                type="text"
                // onSave={(artistName) => saveData({ artistName: artistName.trim() })}
            />
            <Input
                type="button"
                onClick={redirectToManageSubscription}
                loading={loading}
                label="Manage Subscription"
                buttonText={'Change'}
            />
            <NavLink to={match.url + '/get-pro'}>
                <PrimaryButton fullWidth>Go Pro</PrimaryButton>
            </NavLink>
        </SettingsSection>
    );
};

export default ProSection;
