import { useTranslation } from 'react-i18next';

const useNamespaceContent = (resources, ns) => {
    const { i18n, t } = useTranslation();
    i18n.reportNamespaces.addUsedNamespaces([ns]);
    i18n.addResourceBundle(i18n.language, ns, resources[i18n.language], true, false);

    return {
        translate: t,
        currentLanguage: i18n.language,
    };
};

export default useNamespaceContent;
