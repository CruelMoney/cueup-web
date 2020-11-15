import React, { useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import styled from 'styled-components';
import { Input } from './FormComponents';
import { SecondaryButton, RowMobileCol, Hr } from './Blocks';
import { Body, BodySmall, H3 } from './Text';
import GreyBox from './GreyBox';

const CustomGreyBox = styled(GreyBox)`
    p,
    label {
        max-width: 550px;
    }
    label {
        margin-top: 15px;
        margin-bottom: 0;
        margin-top: 0;
        margin-right: 0 !important;
        min-width: 0 !important;
        width: 100%;
    }
`;

const AddBookingLink = ({ user, small, children }) => {
    const [copied, setCopied] = useState(false);
    if (!user) {
        return null;
    }
    const link = `https://cueup.io/${user.permalink}/book`;

    const BodyEl = small ? BodySmall : Body;

    const header = 'Your booking link';

    return (
        <CustomGreyBox>
            {small ? <H3 small>{header}</H3> : <h2>{header}</h2>}
            <BodyEl>
                Make it easier for people to book you on your website or social media. Copy-paste
                your booking link to places where people find you.
            </BodyEl>

            <RowMobileCol style={{ marginTop: 12 }}>
                <Input value={link} />

                {!small ? (
                    <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                        <SecondaryButton disabled={copied} style={{ marginLeft: 0 }}>
                            {copied ? 'Copied' : 'Copy link'}
                        </SecondaryButton>
                    </CopyToClipboard>
                ) : null}
            </RowMobileCol>
            {children}
        </CustomGreyBox>
    );
};

export default AddBookingLink;
