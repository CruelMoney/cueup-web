import React, { useState, useEffect } from 'react';
import { FacebookShareButton, TwitterShareButton, FacebookIcon, TwitterIcon } from 'react-share';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { useServerContext } from 'components/hooks/useServerContext';

const Sharing = ({ url }) => {
    const { environment } = useServerContext();
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        if (copied) {
            setTimeout(() => {
                setCopied(false);
            }, 1500);
        }
    }, [copied]);

    const finalUrl = url ?? environment.WEBSITE_URL;

    return (
        <div className="share-options">
            <FacebookShareButton url={finalUrl}>
                <FacebookIcon size={32} round={true} />
            </FacebookShareButton>
            <TwitterShareButton url={finalUrl}>
                <TwitterIcon size={32} round={true} />
            </TwitterShareButton>
            <CopyToClipboard text={finalUrl} onCopy={() => setCopied(true)}>
                <button className="clipboard-icon">
                    <svg
                        version="1.1"
                        id="Link"
                        xmlns="http://www.w3.org/2000/svg"
                        x="0px"
                        y="0px"
                        viewBox="0 0 20 20"
                        enableBackground="new 0 0 20 20"
                        xmlSpace="preserve"
                    >
                        <path
                            fill="#FFFFFF"
                            d="M7.859,14.691l-0.81,0.805c-0.701,0.695-1.843,0.695-2.545,0c-0.336-0.334-0.521-0.779-0.521-1.252  s0.186-0.916,0.521-1.252l2.98-2.955c0.617-0.613,1.779-1.515,2.626-0.675c0.389,0.386,1.016,0.384,1.403-0.005  c0.385-0.389,0.383-1.017-0.006-1.402C10.069,6.527,7.941,6.791,6.088,8.63l-2.98,2.956C2.393,12.295,2,13.24,2,14.244  c0,1.006,0.394,1.949,1.108,2.658c0.736,0.73,1.702,1.096,2.669,1.096s1.934-0.365,2.669-1.096l0.811-0.805  c0.389-0.385,0.391-1.012,0.005-1.4C8.875,14.309,8.248,14.307,7.859,14.691z M16.891,3.207c-1.547-1.534-3.709-1.617-5.139-0.197  l-1.009,1.002c-0.389,0.386-0.392,1.013-0.006,1.401c0.386,0.389,1.013,0.391,1.402,0.005l1.01-1.001  c0.74-0.736,1.711-0.431,2.346,0.197c0.336,0.335,0.522,0.779,0.522,1.252s-0.186,0.917-0.522,1.251l-3.18,3.154  c-1.454,1.441-2.136,0.766-2.427,0.477c-0.389-0.386-1.016-0.383-1.401,0.005c-0.386,0.389-0.384,1.017,0.005,1.401  c0.668,0.662,1.43,0.99,2.228,0.99c0.977,0,2.01-0.492,2.993-1.467l3.18-3.153C17.605,7.814,18,6.87,18,5.866  C18,4.861,17.605,3.917,16.891,3.207z"
                        />
                    </svg>
                    {copied && <div className="tooltip">Copied to clipboard</div>}
                </button>
            </CopyToClipboard>
        </div>
    );
};

export default Sharing;
