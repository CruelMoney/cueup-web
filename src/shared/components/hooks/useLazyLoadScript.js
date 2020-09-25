import { useState } from 'react';
import useScript from '@charlietango/use-script';

export const useLazyLoadScript = (src) => {
    // we only want to load when starting search
    const [scriptUrl, setScriptUrl] = useState();
    const [loaded] = useScript(scriptUrl);
    const startLoadingScript = () => {
        if (!scriptUrl) {
            setScriptUrl(src);
        }
    };

    return [startLoadingScript, { started: !!scriptUrl, loaded }];
};

// this function will work cross-browser for loading scripts asynchronously
export function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        let r = false;
        s.type = 'text/javascript';
        s.src = src;
        s.async = true;
        s.onerror = function (err) {
            reject(err, s);
        };
        s.onload = s.onreadystatechange = function () {
            // console.log(this.readyState); // uncomment this line to see which ready states are called.
            if (!r && (!this.readyState || this.readyState === 'complete')) {
                r = true;
                resolve();
            }
        };
        const t = document.getElementsByTagName('script')[0];
        t.parentElement.insertBefore(s, t);
    });
}
