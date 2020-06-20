import React from 'react';
import { NavLink, useRouteMatch } from 'react-router-dom';
import { SettingsSection } from 'components/FormComponents';
import { PrimaryButton } from 'components/Blocks';

const ProSection = () => {
    const match = useRouteMatch();

    return (
        <SettingsSection id="professional" title={'Professional'} description={''}>
            <NavLink to={match.url + '/professional'}>
                <PrimaryButton fullWidth>Upgrade</PrimaryButton>
            </NavLink>
        </SettingsSection>
    );
};

export default ProSection;
