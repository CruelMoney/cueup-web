import React from 'react';
import { NavLink, useRouteMatch, Route, useLocation } from 'react-router-dom';
import { useLazyQuery } from 'react-apollo';
import { SettingsSection, Input } from 'components/FormComponents';
import { PrimaryButton } from 'components/Blocks';
import { MANAGE_SUBSCRIPTION } from 'routes/User/gql';
import TaxIdInput from 'components/TaxID';
import { BodySmall, Body } from 'components/Text';
import { validators } from 'components/hooks/useForm';

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
                description="Display a link to your website on your profile."
            />

            <Input half label="Snapchat" />
            <Input half label="YouTube" />

            <Input half label="Twitter" />
        </SettingsSection>
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
