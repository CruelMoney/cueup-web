import React from 'react';
import InstagramLogo from '../../../../assets/InstagramLogo';

const InstagramWidget = () => {
    return (
        <div className="ph-widget">
            <a
                href="https://instagram.com/a/r/?effect_id=646874336166118"
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-filter-link"
            >
                Try the Instagram filter
                <InstagramLogo />
            </a>
        </div>
    );
};

export default InstagramWidget;
