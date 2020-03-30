import { languagesArray } from './languages';

const config = {
    debug: false,
    language: 'en',
    fallbackLng: 'en',
    defaultNS: 'common',
    languages: languagesArray,
    whitelist: languagesArray,
    cleanCode: true,
    caches: false,
    load: 'languageOnly',
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
    detection: {
        order: ['path', 'session'],
    },
};

export default config;
