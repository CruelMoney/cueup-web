import React, { Component, useEffect } from 'react';

const Privacy = () => {
    useEffect(() => {
        (function (w, d) {
            const loader = function () {
                const s = d.createElement('script');
                const tag = d.getElementsByTagName('script')[0];
                s.src = 'https://cdn.iubenda.com/iubenda.js';
                tag.parentNode.insertBefore(s, tag);
            };
            loader();
        })(window, document);
    }, []);

    return (
        <div>
            <a
                href="https://www.iubenda.com/privacy-policy/30255398"
                className="iubenda-white no-brand iubenda-embed iub-legal-only iub-body-embed"
                title="Privacy Policy"
            >
                Privacy Policy
            </a>
        </div>
    );
};

export default Privacy;
