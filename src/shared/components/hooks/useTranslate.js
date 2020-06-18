import { useTranslation } from 'react-i18next';

const useTranslate = () => {
    const { t, i18n } = useTranslation();

    return {
        t,
        translate: t,
        currentLanguage: i18n.language,
    };
};

export default useTranslate;
