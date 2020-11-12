import React, { useState, useEffect } from 'react';

import { Col } from 'components/Blocks';

import { ProFeature } from 'components/FormComponents';
import { Testimonial, CustomCheckBox } from './BenefitsPopup';

import GenericPopup from './GenericPopup';

export const BenefitsPopup = () => {
    return (
        <GenericPopup>
            <h2 style={{ marginBottom: 24 }}>
                Go Pro
                <br />
                <span style={{ fontWeight: 500 }}>
                    Get contact details before booking has been confirmed.
                </span>
            </h2>

            <Col>
                <CustomCheckBox checked label="Top position in search results." />
                <CustomCheckBox checked label="No commission fee on gigs." />
                <CustomCheckBox checked label="Unlimited playing locations & travel." />
                <CustomCheckBox checked label="Add website & social media links to profile." />
                <CustomCheckBox
                    checked
                    label="Automatic refund each month if you don't receive any gig requests."
                />
                <CustomCheckBox checked label="Unlimited sound uploads." />
                <CustomCheckBox checked label={'Pro Badge'}>
                    <ProFeature disabled>{'Pro'} </ProFeature>
                </CustomCheckBox>
                <CustomCheckBox checked label="And much more..." />
                <Testimonial />
            </Col>
        </GenericPopup>
    );
};

export default BenefitsPopup;
