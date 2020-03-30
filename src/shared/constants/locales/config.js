const config = {
    lng: 'en',
    fallbackLng: 'en',
    load: 'languageOnly',
    keySeparator: false, // we do not use keys in form messages.welcome

    interpolation: {
        escapeValue: false, // react already safes from xss
    },
};

export default config;
