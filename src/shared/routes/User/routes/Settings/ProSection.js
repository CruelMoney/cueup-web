import React from 'react';
import { NavLink, useRouteMatch, Route } from 'react-router-dom';
import { SettingsSection } from 'components/FormComponents';
import { PrimaryButton } from 'components/Blocks';
import Popup from 'components/common/Popup';

const ProSection = () => {
    const match = useRouteMatch();

    return (
        <SettingsSection id="pro" title={'Cueup Pro'} description={''}>
            <NavLink to={match.url + '/get-pro'}>
                <PrimaryButton fullWidth>Go Pro</PrimaryButton>
            </NavLink>
        </SettingsSection>
    );
};

export default ProSection;
