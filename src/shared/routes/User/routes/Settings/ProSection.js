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
                        ✔ Remove service fees
                        <br />✔ Priority on new events
                        <br />✔ Unlimited playing locations
                        <br />✔ Direct contact to organizers
                        <br />✔ And so much more...
                    </Body>
                    {!isPro && (
                        <>
                            <NavLink to={match.url + '/get-pro'}>
                                <PrimaryButton fullWidth>Go Pro</PrimaryButton>
                            </NavLink>
                            <BodySmall style={{ marginTop: 3, textAlign: 'center' }}>
                                Automatic refund if you don't receive any gig requests.
                            </BodySmall>
                        </>
                    )}
                </>
            }
        >
            <Input
                type="button"
                onClick={redirectToManageSubscription}
                loading={loading}
                label="Manage subscription"
                buttonText={'Update'}
                description="Download invoices, and change or cancel your subscription."
            />
            <TaxIdInput
                label="Tax ID"
                type="text"
                onSave={({ taxId, taxType }) => saveData({ taxId: taxId.trim(), taxType })}
            />
            <Input
                label="Website"
                defaultValue={website}
                placeholder={`https://${permalink ? permalink : firstName}.com`}
                type="text"
                onSave={(website) => saveData({ website: getUrl(website) })}
                validation={(value) =>
                    validators.containsURL(true)(value) ? null : 'Not a valid URL'
                }
            />

            <PublicDisplaySettings
                user={user}
                onSave={(publicDisplaySettings) => saveData({ publicDisplaySettings })}
            />
        </SettingsSection>
    );
};

const PublicDisplaySettings = ({ user, onSave }) => {
    const { publicDisplay = {} } = user?.userSettings || {};
    const [internal, setInternal] = useState(publicDisplay);

    const onChange = (key) => (val) => {
        const newNotifications = {
            ...internal,
            [key]: {
                ...internal[key],
                public: val,
            },
        };
        setInternal(newNotifications);
        onSave(newNotifications);
    };

    return (
        <Col style={{ width: '100%', marginRight: '36px' }}>
            <TableRow>
                <Label>Information</Label>
                <Label>Public</Label>
            </TableRow>
            <Hr />
            <CheckBoxRow
                label="Website"
                withBorder={false}
                checked={internal.WEBSITE?.public}
                onChange={onChange('WEBSITE')}
            />
            <CheckBoxRow
                label="Email"
                withBorder={false}
                checked={internal.EMAIL?.public}
                onChange={onChange('EMAIL')}
            />
            <CheckBoxRow
                label="Phone"
                withBorder={false}
                checked={internal.PHONE?.public}
                onChange={onChange('PHONE')}
            />
            <CheckBoxRow
                label="SoundCloud"
                withBorder={false}
                checked={internal.SOUNDCLOUD?.public}
                onChange={onChange('SOUNDCLOUD')}
            />
            <CheckBoxRow
                label="Mixcloud"
                withBorder={false}
                checked={internal.MIXCLOUD?.public}
                onChange={onChange('MIXCLOUD')}
            />
            <CheckBoxRow
                label="Instagram"
                withBorder={false}
                checked={internal.INSTAGRAM?.public}
                onChange={onChange('INSTAGRAM')}
            />
            <Hr />
            <BodySmall style={{ marginTop: 6 }}>
                Publicly display your contact information and social links on your profile.
                Organizers will always be able to see contact information.
            </BodySmall>
        </Col>
    );
};

const getUrl = (value) => {
    function addhttp(url) {
        if (!/^(?:f|ht)tps?:\/\//.test(url)) {
            url = 'https://' + url;
        }
        return url;
    }

    return new URL(addhttp(value));
};

export default ProSection;
