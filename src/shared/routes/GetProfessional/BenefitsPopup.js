import React, { useState, useEffect } from 'react';
import styled, { css } from 'styled-components';

import { Row, Col, Avatar } from 'components/Blocks';
import { BodySmall } from 'components/Text';
import { DumbCheckbox } from 'components/Checkbox';

import { ProFeature } from 'components/FormComponents';
import GenericPopup from './GenericPopup';

export const BenefitsPopup = () => {
    return (
        <GenericPopup>
            <h2 style={{ marginBottom: 24 }}>Play more gigs with Cueup Pro</h2>
            <CustomCheckBox
                checked
                label="Get contact details before booking has been confirmed."
            />
            <CustomCheckBox checked label="Top position in search results." />
            <CustomCheckBox checked label="No commission fee on gigs." />
            <CustomCheckBox checked label="Unlimited playing locations & travel." />
            <CustomCheckBox checked label="Add website & social media links to profile." />
            <CustomCheckBox
                checked
                label="Automatic refund each month if you don't receive any gig requests."
            />
            <CustomCheckBox checked label="Unlimited sound uploads." />
            <CustomCheckBox checked label={'Pro DJ badge.'} />
            <CustomCheckBox checked label="And much more..." />
        </GenericPopup>
    );
};

export const CustomCheckBox = styled(DumbCheckbox)`
    margin-bottom: 1em;
    div {
        cursor: default !important;
    }
`;

export default BenefitsPopup;
