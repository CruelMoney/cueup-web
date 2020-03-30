import { languagesArray } from './languages';

const config = {
    debug: true,
    language: 'en',
    fallbackLng: 'en',
    languages: languagesArray,
    cleanCode: true,
    load: 'languageOnly',
    keySeparator: false, // we do not use keys in form messages.welcome
    interpolation: {
        escapeValue: false, // react already safes from xss
    },
    detection: {
        order: ['path', 'session'],
    },
};

export default config;
