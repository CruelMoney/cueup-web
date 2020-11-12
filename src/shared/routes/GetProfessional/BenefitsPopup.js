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
            <Testimonial />
        </GenericPopup>
    );
};

export const Testimonial = () => {
    return (
        <TestimonialWrapper>
            <Avatar size="large" src={'https://i.vimeocdn.com/portrait/13325432_640x640'} />
            <BodySmall style={{ marginLeft: 12 }}>
                "I like to dj and travel. As a pro member I’ve had a steady stream of gigs most
                places I go. Best investment I’ve made in a while!"
                <Quotee>- Oscar Bandersen, DJ & Producer</Quotee>
            </BodySmall>
        </TestimonialWrapper>
    );
};

export const CustomCheckBox = styled(DumbCheckbox)`
    margin-bottom: 1em;
    div {
        cursor: default !important;
    }
`;

const TestimonialWrapper = styled(Row)`
    margin-top: 1em;
    img {
        transform: scale(1.8);
    }
`;

const Quotee = styled.span`
    display: block;
    font-weight: 500;
    color: #98a4b3;
`;

export default BenefitsPopup;
