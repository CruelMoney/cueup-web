import { useEffect } from 'react';
import { loadGoogleAnalytics } from './ga';
import { loadOlark } from './olark';
import { loadOneSignal } from './oneSignal';

const excludedOlarkRoutes = ['gig', 'dj-name-generator'];
const excludedScriptsRoutes = ['dj-name-generator'];

const useExternals = () => {
    useEffect(() => {
        const excludeScripts = excludedScriptsRoutes.some((s) =>
            window.location.pathname.includes(s)
        );

        setTimeout(() => {
            if (!excludedOlarkRoutes.some((s) => window.location.pathname.includes(s))) {
                loadOlark();
            }
            if (!excludeScripts) {
                loadOneSignal();
            }
            loadGoogleAnalytics();
        }, 4000);
    }, []);
};

export default useExternals;
