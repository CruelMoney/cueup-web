import React, { useEffect } from 'react';

const CookiePolicy = () => {
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
                href="https://www.iubenda.com/privacy-policy/30255398/cookie-policy"
                className="iubenda-white no-brand iubenda-embed iub-body-embed"
                title="Cookie Policy"
            >
                Cookie Policy
            </a>
        </div>
    );
};

export default CookiePolicy;
