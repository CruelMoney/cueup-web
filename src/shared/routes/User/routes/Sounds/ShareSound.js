import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Row, SecondaryButton, TextInput } from 'components/Blocks';

import { useServerContext } from 'components/hooks/useServerContext';
import { Title } from '../../../../components/Text';

const getIframeCode = ({ websiteUrl, url, title, id, user, withFrame }) => {
    const { permalink, artistName, userMetadata } = user || {};

    const byName = artistName || userMetadata?.firstName;
    const iframeUrl = `${websiteUrl}/widget/player/${id}/${user?.id || ''}`;
    const userLink = `${websiteUrl}/user/${permalink}`;
    const songLink = `${userLink}/sounds/${url}`;

    return `<iframe width="100%" height="193" scrolling="no" style="${
        withFrame ? 'border-radius: 4px; border: 0.5px solid #e1e5ea;' : ''
    }" allow="autoplay" src="${iframeUrl}"></iframe><div style="font-size: 10px; color: #cccccc;line-break: anywhere;word-break: normal;overflow: hidden;white-space: nowrap;text-overflow: ellipsis; font-family: 'Avenir Next',Open Sans,Segoe UI,Helvetica,sans-serif ;font-weight: 100;"><a href="${userLink}" title="${byName}" target="_blank" style="color: #cccccc; text-decoration: none;">${byName}</a> · <a href="${songLink}" title="${title}" target="_blank" style="color: #cccccc; text-decoration: none;">${title}</a></div>`;
};

const ShareSound = ({ id, url, user, title }) => {
    const [copied, setCopied] = useState(false);
    const [copiedCode, setCopiedCode] = useState(false);
    const { environment } = useServerContext();
    const iframeCode = getIframeCode({ websiteUrl: environment.WEBSITE_URL, id, user, title, url });
    const iframeCodeShow = getIframeCode({
        websiteUrl: environment.WEBSITE_URL,
        id,
        user,
        title,
        url,
        withFrame: true,
    });

    return (
        <div>
            <Title>Share link</Title>
            <Row>
                <TextInput value={url} />

                <CopyToClipboard text={url} onCopy={() => setCopied(true)}>
                    <SecondaryButton disabled={copied} style={{ marginLeft: 6, maxHeight: 35 }}>
                        {copied ? 'Copied' : 'Copy link'}
                    </SecondaryButton>
                </CopyToClipboard>
            </Row>

            <Title style={{ marginTop: 30 }}>Embed code</Title>
            <Row>
                <TextInput value={iframeCode} />
                <CopyToClipboard text={iframeCode} onCopy={() => setCopiedCode(true)}>
                    <SecondaryButton disabled={copiedCode} style={{ marginLeft: 6, maxHeight: 35 }}>
                        {copiedCode ? 'Copied' : 'Copy code'}
                    </SecondaryButton>
                </CopyToClipboard>
            </Row>
            <div
                style={{
                    marginTop: 12,
                }}
                dangerouslySetInnerHTML={{ __html: iframeCodeShow }}
            />
        </div>
    );
};

export default ShareSound;
