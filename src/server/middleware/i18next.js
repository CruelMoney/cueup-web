import middleware from 'i18next-http-middleware';
import i18next from 'i18next';
import config from 'constants/locales/config';
import en from 'constants/locales/en';
import da from 'constants/locales/da';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en,
    da,
};

export const addLanguage = async (req, res, next) => {
    const i18n = i18next.createInstance();
    i18n.use(middleware.LanguageDetector).init({ ...config, resources });

    middleware.handle(i18n, {
        removeLngFromUrl: false,
    })(req, res, next);
};
