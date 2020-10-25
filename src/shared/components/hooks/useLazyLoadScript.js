import { useCallback, useState } from 'react';

export const useLazyLoadScript = (src) => {
    // we only want to load when starting search
    const [scriptUrl, setScriptUrl] = useState();
    const [loaded, setLoaded] = useState(false);
    const startLoadingScript = useCallback(async () => {
        if (!scriptUrl) {
            console.log('loading');

            setScriptUrl(src);
            await loadScript(src);
            console.log('loaded');

            setLoaded(true);
        }
    }, [scriptUrl, src]);

    return [startLoadingScript, { started: !!scriptUrl, loaded }];
};

const scripts = {};
function loadScript(src) {
    return new Promise((resolve, reject) => {
        // check if script already exists
        const existingScript = document.querySelector(`script[src="${src}"]`);
        let s = existingScript;
        if (!s) {
            scripts[src] = {
                loaded: false,
                error: false,
            };
            s = document.createElement('script');
            s.type = 'text/javascript';
            s.src = src;
            s.async = true;
            let r = false;
            s.onerror = function (err) {
                reject(err, s);
                scripts[src].error = err;
            };
            s.onload = s.onreadystatechange = function () {
                console.log(this.readyState); // uncomment this line to see which ready states are called.
                if (!r && (!this.readyState || this.readyState === 'complete')) {
                    r = true;
                    resolve();
                    scripts[src].loaded = true;
                }
            };
            const t = document.getElementsByTagName('script')[0];
            t.parentElement.insertBefore(s, t);
        } else {
            setInterval(() => {
                const { loaded, error } = scripts[src] || {};
                if (loaded) {
                    resolve();
                } else if (error) {
                    reject(error, s);
                }
            }, 100);
        }
    });
}
