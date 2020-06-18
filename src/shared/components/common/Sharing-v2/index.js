import React from 'react';
import {
    FacebookShareButton,
    LinkedinShareButton,
    TwitterShareButton,
    EmailShareButton,
    FacebookIcon,
    TwitterIcon,
    LinkedinIcon,
    EmailIcon,
} from 'react-share';
import { Icon } from '@iconify/react';
import arrowRedo from '@iconify/icons-ion/arrow-redo';

import { useServerContext } from 'components/hooks/useServerContext';
import './index.css';

const Sharing = (shareUrl, title) => {
    const { environment } = useServerContext();
    let url = String(environment.CALLBACK_DOMAIN);
    url += String(shareUrl);

    return (
        <div className="share-buttons">
            <FacebookShareButton url={url} className="share-button" quote={title}>
                <FacebookIcon size={32} round />
                <span>Share</span>
            </FacebookShareButton>
            <TwitterShareButton url={url} className="share-button" title={title}>
                <TwitterIcon size={32} round />
                <span>Tweet</span>
            </TwitterShareButton>
            <LinkedinShareButton
                url={url}
                className="share-button"
                title={title}
                windowWidth={750}
                windowHeight={600}
            >
                <LinkedinIcon size={32} round />
                <span>Share</span>
            </LinkedinShareButton>
            <EmailShareButton url={url} className="share-button" subject={title} body={url}>
                <EmailIcon size={32} round />
                <span>Email</span>
            </EmailShareButton>
        </div>
    );
};

export default Sharing;

const SimpleSharing = ({ shareUrl, title, style, label = 'Share profile' }) => {
    const { environment } = useServerContext();

    let url = String(environment.CALLBACK_DOMAIN);
    url += String(shareUrl);

    const share = () => {
        if (navigator.share) {
            navigator
                .share({
                    title,
                    text: title,
                    url,
                })
                .then(() => console.log('Successful share'))
                .catch((error) => console.log('Error sharing', error));
        }
    };
    return (
        <div
            className="simple-share"
            style={{
                display: 'flex',
                alignItems: 'center',
                ...style,
            }}
        >
            <p
                style={{
                    fontSize: '15px',
                    color: '#4D6480',
                    marginBottom: 0,
                    fontWeight: 700,
                }}
            >
                {label}
            </p>
            <TwitterShareButton url={url} title={title}>
                <TwitterIcon size={32} bgStyle={{ fill: 'transparent' }} iconFillColor="#98A4B3" />
            </TwitterShareButton>
            <FacebookShareButton
                url={url}
                quote={title}
                style={{ background: 'transparent', width: 24 }}
            >
                <FacebookIcon size={32} bgStyle={{ fill: 'transparent' }} iconFillColor="#98A4B3" />
            </FacebookShareButton>
            <button className="react-share__ShareButton" onClick={share}>
                <Icon
                    icon={arrowRedo}
                    color={'#98A4B3'}
                    style={{ marginBottom: '3px', fontSize: '18px' }}
                />
            </button>
        </div>
    );
};

export { SimpleSharing };
