import React, { useState } from 'react';
import { NavLink, useRouteMatch, Route, useLocation } from 'react-router-dom';
import { useLazyQuery } from 'react-apollo';
import { SettingsSection, Input, Label } from 'components/FormComponents';
import { PrimaryButton, Hr, Col, Row } from 'components/Blocks';
import { MANAGE_SUBSCRIPTION } from 'routes/User/gql';
import TaxIdInput from 'components/TaxID';
import { BodySmall, Body } from 'components/Text';
import { validators } from 'components/hooks/useForm';
import { CheckBoxRow, TableRow } from 'components/CheckboxTable';

const ProSection = ({ user, saveData }) => {
    const match = useRouteMatch();

    const { appMetadata, permalink, userMetadata } = user || {};
    const isPro = appMetadata?.isPro;
    const { firstName, website } = userMetadata || {};

    return (
        <SettingsSection
            id="pro"
            title={'Cueup Pro'}
            disable={!isPro}
            description={
                <>
                    <Body style={{ marginBottom: 12 }}>
                        ✔ No service fees
                        <br />✔ Priority on new events
                        <br />✔ Unlimited playing locations
                        <br />✔ Direct contact to organizers
                        <br />✔ Attach documents to offers
                        <br />✔ Unlimited sound uploads
                        <br />✔ And so much more...
                    </Body>
                    {!isPro && (
                        <>
                            <NavLink to={match.url + '/get-pro'}>
                                <PrimaryButton fullWidth data-cy="go-pro-button">
                                    Go Pro
                                </PrimaryButton>
                            </NavLink>
                            <BodySmall style={{ marginTop: 3, textAlign: 'center' }}>
                                Automatic refund if you don't receive any gig requests.
                            </BodySmall>
                        </>
                    )}
                </>
            }
        />
    );
};

export default ProSection;
