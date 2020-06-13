import { useEffect } from 'react';
import { loadOneSignal } from './oneSignal';

const excludedScriptsRoutes = ['dj-name-generator'];

const useExternals = () => {
    useEffect(() => {
        const excludeScripts = excludedScriptsRoutes.some((s) =>
            window.location.pathname.includes(s)
        );

        setTimeout(() => {
            if (!excludeScripts) {
                loadOneSignal();
            }
        }, 4000);
    }, []);
};

export default useExternals;
