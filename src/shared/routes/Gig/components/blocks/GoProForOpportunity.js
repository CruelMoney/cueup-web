import React from 'react';

import { NavLink } from 'react-router-dom';
import { useRouteMatch } from 'react-router';
import GreyBox from 'components/GreyBox';

import { ProFeature } from 'components/FormComponents';
import { PrimaryButton } from 'components/Blocks';
import { Body, BodySmall, TitleClean } from '../../../../components/Text';

const GoProForOpportunity = ({ me }) => {
    const { url } = useRouteMatch();
    return (
        <NavLink to={url + '/get-pro'}>
            <GreyBox style={{ textAlign: 'center' }}>
                <ProFeature style={{ marginBottom: 6, marginLeft: 0 }}>Pro only</ProFeature>
                <TitleClean style={{ marginBottom: '0.5em', textAlign: 'center' }}>
                    Opportunities are for Pros only
                </TitleClean>

                <div
                    style={{
                        marginBottom: 24,

                        marginTop: 24,
                    }}
                >
                    <Body
                        style={{
                            lineHeight: '1.75em',
                            whiteSpace: 'pre',
                            textAlign: 'left',
                            display: 'inline-block',
                        }}
                    >
                        ✔{'   '}Contact details available any time
                        <br />✔{'   '}Top position in search results
                        <br />✔{'   '}No commission fees
                        <br />✔{'   '}Unlimited playing locations
                        <br />✔{'   '}Add website link to profile
                        <br />✔{'   '}Unlimited sound uploads
                        <br />✔{'   '}Pro Badge
                        <br />✔{'   '}And much more...
                    </Body>
                </div>

                <PrimaryButton style={{ margin: 'auto', marginTop: '24px' }}>
                    Go Pro to unlock gig
                </PrimaryButton>
            </GreyBox>
        </NavLink>
    );
};

export default GoProForOpportunity;
