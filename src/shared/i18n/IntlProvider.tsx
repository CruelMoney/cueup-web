import React, { useEffect } from 'react';
import i18next from 'i18next';
import i18nextXHRBackend from 'i18next-xhr-backend';
import { I18nextProvider } from 'react-i18next';

i18next.languages = ['da_DK', 'en_US'];

const options: i18next.InitOptions = {
    backend: {
        // for all available options read the backend's repository readme file
        loadPath: '/locales/{{lng}}/{{ns}}.json',
    },
    react: {
        // Must be false until Suspense is supported on the server side
        useSuspense: false,
        wait: true,
    },
    interpolation: {
        escapeValue: false, // not needed for react!!
    },
    debug: process.env.NODE_ENV === 'development' && __BROWSER__,
    fallbackLng: 'en_US',
    fallbackNS: ['translation'],
    // This option is necessary to tell i18next to try loading missing resources via
    // i18next-xhr-backend, otherwise no calls will be made if resources are defined.
    partialBundledLanguages: true,

    parseMissingKeyHandler: (missing: any) => {
        if (process.env.NODE_ENV === 'development' && __BROWSER__) {
            console.warn('MISSING TRANSLATION:', missing);
        }
        return missing;
    },
};

// browser options
if (__BROWSER__) {
    i18next.use(i18nextXHRBackend);
}

// server options
if (__SERVER__) {
    options.preload = i18next.languages;
}

i18next.init(options);

const I18N: React.FC<any> = ({ children }) => {
    // const locale = useSelector(getLocale);
    // useEffect(() => {
    //     i18next.changeLanguage(locale);
    // }, [locale]);

    return <I18nextProvider i18n={i18next}>{children}</I18nextProvider>;
};

export default React.memo(I18N);
