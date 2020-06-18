import { useTranslation } from 'react-i18next';
import { languages } from 'constants/locales/languages';

const useNamespaceContent = (resources, ns) => {
    const { i18n, t } = useTranslation();
    const currentLanguage = i18n.language;
    i18n.reportNamespaces.addUsedNamespaces([ns]);
    i18n.addResourceBundle(i18n.language, ns, resources[currentLanguage], true, false);

    // add as that is our fallback
    if (currentLanguage !== languages.en) {
        i18n.addResourceBundle(currentLanguage, ns, resources[languages.en], true, false);
    }

    return {
        translate: t,
        currentLanguage: currentLanguage,
    };
};

export default useNamespaceContent;
