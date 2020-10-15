import { useCallback, useState } from 'react';
import useScript from '@charlietango/use-script';

export const useLazyLoadScript = (src) => {
    // we only want to load when starting search
    const [scriptUrl, setScriptUrl] = useState();
    const [loaded] = useScript(scriptUrl);
    const startLoadingScript = useCallback(() => {
        if (!scriptUrl) {
            setScriptUrl(src);
        }
    }, [scriptUrl, src]);

    return [startLoadingScript, { started: !!scriptUrl, loaded }];
};
