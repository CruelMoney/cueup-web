import middleware from 'i18next-express-middleware';
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

i18next.use(middleware.LanguageDetector).init({ ...config, resources });

export const addLanguage = middleware.handle(i18next, {
    removeLngFromUrl: false,
});
