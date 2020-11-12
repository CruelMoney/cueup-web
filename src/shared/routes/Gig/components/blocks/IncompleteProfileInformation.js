import React from 'react';

import GreyBox from 'components/GreyBox';

import ProfileProgress from 'routes/User/components/ProfileProgress';

import { TitleClean } from '../../../../components/Text';

const IncompleteProfileInformation = ({ me }) => {
    return (
        <GreyBox>
            <TitleClean>Complete your profile to accept opportunity</TitleClean>
            {me && <ProfileProgress user={me} hideSharing onlyShowRequired />}
        </GreyBox>
    );
};

export default IncompleteProfileInformation;
