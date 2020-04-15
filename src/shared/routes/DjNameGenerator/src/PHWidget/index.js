import React from 'react';

const PHWidget = () => {
    return (
        <div className="ph-widget">
            <a
                href="https://www.producthunt.com/posts/dj-name-generator?utm_source=badge-featured&utm_medium=badge&utm_souce=badge-dj-name-generator"
                target="_blank"
                rel="noopener noreferrer"
            >
                <img
                    src="https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=192920&theme=dark"
                    alt="DJ Name Generator - Find your next DJ name | Product Hunt Embed"
                    style={{ width: '250px', height: '54px' }}
                    width="250px"
                    height="54px"
                />
            </a>
        </div>
    );
};

export default PHWidget;
