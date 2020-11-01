import React, { useState } from 'react';
import styled from 'styled-components';

import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Input } from './FormComponents';
import { SecondaryButton, RowMobileCol, Hr } from './Blocks';
import { Body } from './Text';

const GreyBox = styled.section`
    background-color: #f7f9fc;
    border-radius: 12px;
    width: 100%;
    padding: 20px 30px;
    margin-left: auto;

    margin-bottom: 30px;
    position: relative;

    left: 50%;
    transform: translateX(-50%);
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
    input {
        background-color: white !important;
        cursor: text;
    }
`;

const AddBookingLink = ({ user }) => {
    const [copied, setCopied] = useState(false);
    if (!user) {
        return null;
    }
    const link = `https://cueup.io/${user.permalink}/book`;

    return (
        <>
            <GreyBox>
                <h2>Your booking link</h2>
                <Body>
                    Make it easier for people to book you on your website or social media. Copy
                    paste your booking link to places where people find you.
                </Body>

                <RowMobileCol style={{ marginTop: 12 }}>
                    <Input value={link} />

                    <CopyToClipboard text={link} onCopy={() => setCopied(true)}>
                        <SecondaryButton disabled={copied} style={{ marginLeft: 0 }}>
                            {copied ? 'Copied' : 'Copy link'}
                        </SecondaryButton>
                    </CopyToClipboard>
                </RowMobileCol>
            </GreyBox>
            <Hr style={{ marginBottom: 30 }} />
        </>
    );
};

export default AddBookingLink;
