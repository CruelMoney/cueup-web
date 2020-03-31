import { useRouteMatch } from 'react-router';
import { useTranslation } from 'react-i18next';
import { languagesArray, languageObjects } from 'constants/locales/languages';
import { useServerContext } from './useServerContext';

const useAlternativePages = () => {
    // get route key by reverse matching
    const { environment } = useServerContext();

    const match = useRouteMatch();
    const { i18n, t } = useTranslation();

    const routes = i18n.getResourceBundle(i18n.language, 'routes');
    const [routeKey] = Object.entries(routes).find(([_key, val]) => val === match.path) || [];

    if (!routeKey) {
        return [];
    }

    const alternatePages = languagesArray
        .map((lng) => {
            const route = t('routes:' + routeKey, { lng, defaultValue: null });
            if (!route) {
                return null;
            }

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
