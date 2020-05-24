import { useEffect } from 'react';
import ReactPixel from 'react-facebook-pixel';
import { loadGoogleAnalytics } from './ga';
import { loadOlark } from './olark';
import { loadOneSignal } from './oneSignal';

const isDevelopment = process.env.NODE_ENV === 'development';

const excludedOlarkRoutes = ['gig', 'dj-name-generator'];
const excludedScriptsRoutes = ['dj-name-generator'];

const useExternals = () => {
    useEffect(() => {
        const excludeScripts = excludedScriptsRoutes.some((s) =>
            window.location.pathname.includes(s)
        );

        setTimeout(() => {
            if (!isDevelopment) {
                loadGoogleAnalytics();
                ReactPixel.init(window.__ENVIRONMENT__.PIXEL_ID);
                ReactPixel.pageView();
            }
        }, 2000);

        setTimeout(() => {
            if (!excludedOlarkRoutes.some((s) => window.location.pathname.includes(s))) {
                loadOlark();
            }
            if (!excludeScripts) {
                loadOneSignal();
            }
        }, 4000);
    }, []);
};

export default useExternals;
