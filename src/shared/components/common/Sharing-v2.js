import React, { Component } from 'react';
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
import ShareIcon from 'react-ionicons/lib/MdShareAlt';
import { Environment } from '../../constants/constants';

class Sharing extends Component {
    render() {
        const { shareUrl, title } = this.props;
        let url = String(Environment.CALLBACK_DOMAIN);
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
    }
}

export default Sharing;

const SimpleSharing = ({ shareUrl, title, style, label = 'Share profile' }) => {
    let url = String(Environment.CALLBACK_DOMAIN);
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
            style={{
                display: 'flex',
                alignItems: 'center',
                ...style,
            }}
        >
            <p
                style={{
                    fontFamily: 'AvenirNext',
                    fontSize: '15px',
                    color: '#4D6480',
                    marginBottom: 0,
                }}
            >
                {label}
            </p>
            <TwitterShareButton
                style={{ background: 'transparent', width: 24 }}
                url={url}
                title={title}
            >
                <TwitterIcon
                    size={32}
                    iconBgStyle={{ fill: 'transparent' }}
                    logoFillColor="#98A4B3"
                />
            </TwitterShareButton>
            <FacebookShareButton
                url={url}
                quote={title}
                style={{ background: 'transparent', width: 24 }}
            >
                <FacebookIcon
                    size={32}
                    iconBgStyle={{ fill: 'transparent' }}
                    logoFillColor="#98A4B3"
                />
            </FacebookShareButton>
            <button onClick={share}>
                <ShareIcon color={'#98A4B3'} style={{ marginLeft: '5px' }} />
            </button>
        </div>
    );
};

export { SimpleSharing };
