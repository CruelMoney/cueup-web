import { useTranslation } from 'react-i18next';

const useTranslate = () => {
    const { t, i18n } = useTranslation();

    const translate = (...args) => {
        const key = args[0];
        const ns = key.split(':')[0];
        i18n.reportNamespaces.addUsedNamespaces([ns]);
        return t(...args);
    };

    return {
        t: translate,
        translate,
        currentLanguage: i18n.language,
    };
};

export default useTranslate;
