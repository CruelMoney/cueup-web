import React, { useState, useEffect } from 'react';

import { Col } from 'components/Blocks';

import { Testimonial, CustomCheckBox } from './BenefitsPopup';

import GenericPopup from './GenericPopup';

export const BenefitsPopup = () => {
    return (
        <GenericPopup>
            <h1>Go Pro and contact organizers any time</h1>

            <Col>
                <CustomCheckBox checked label="No service fee on gigs." />
                <CustomCheckBox checked label="Direct contact to organizers." />
                <CustomCheckBox checked label="Priority on new events." />
                <CustomCheckBox checked label="Unlimited playing locations & travel." />
                <CustomCheckBox checked label="Add website & social media links to profile." />
                <CustomCheckBox
                    checked
                    label="Automatic refund each month if you don't receive any gig requests."
                />
                <CustomCheckBox checked label="Unlimited mixtape uploads in 320kbps." />
                <CustomCheckBox checked label="Attach documents to offers." />
                <CustomCheckBox checked label="...and so much more. Read more here." />
                <Testimonial />
            </Col>
        </GenericPopup>
    );
};

export default BenefitsPopup;
