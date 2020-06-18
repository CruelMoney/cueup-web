import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { match, compile } from 'path-to-regexp';
import { languagesArray, languageObjects } from 'constants/locales/languages';
import { useServerContext } from './useServerContext';

const useAlternativePages = () => {
    const { environment } = useServerContext();
    const location = useLocation();
    const { i18n, t } = useTranslation();
    const routes = i18n.getResourceBundle(i18n.language, 'routes');

    // get route key by reverse matching
    let routeMatch;
    Object.entries(routes).find(([key, val]) => {
        const m = match(val)(location.pathname);
        if (!m) {
            return false;
        }

        routeMatch = {
            key,
            params: m.params,
        };
        return true;
    });

    if (!routeMatch) {
        return [];
    }

    // replace params in route
    const { key, params } = routeMatch;

    const alternatePages = languagesArray
        .map((lng) => {
            let route = t('routes:' + key, { lng, defaultValue: null });
            if (!route) {
                return null;
            }

            // make it back to real url with params
            const toPath = compile(route);
            route = toPath(params);

            return {
                ...languageObjects[lng],
                route,
                url: environment.CALLBACK_DOMAIN + route,
                active: lng === i18n.language,
            };
        })
        .filter(Boolean);

    return alternatePages;
};

export default useAlternativePages;
