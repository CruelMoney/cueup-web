const config = {
    debug: true,
    fallbackLng: 'en',
    cleanCode: true,
    load: 'languageOnly',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
        escapeValue: false, // react already safes from xss
    },
};

export default config;
