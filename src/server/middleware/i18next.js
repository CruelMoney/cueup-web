import middleware from 'i18next-express-middleware';
import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from 'constants/locales/config';

i18next.use(middleware.LanguageDetector).init(config);

export const addLanguage = middleware.handle(i18next, {
    removeLngFromUrl: false,
});
