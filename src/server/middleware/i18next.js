import middleware from 'i18next-express-middleware';
import i18next from 'i18next';
import config from 'constants/locales/config';

// the translations
// (tip move them in a JSON file and import them)
const resources = {
    en: {
        translation: {
            'Welcome to React': 'Welcome to React and react-i18next',
            'not-found-title': '404 Not found',
        },
    },
    da: {
        translation: {
            'Welcome to React': 'Welcome to React and react-i18next',
            'not-found-title': '404 Ikke fundet',
        },
    },
};

i18next.use(middleware.LanguageDetector).init({ ...config, resources });

export const addLanguage = middleware.handle(i18next, {
    removeLngFromUrl: false,
});
