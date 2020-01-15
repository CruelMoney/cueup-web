import React from 'react';
import { IntlProvider, useIntl } from 'react-intl';

const addTranslate = (Wrappee, content) => {
    const Index = (props) => {
        const { locale, formatMessage } = useIntl();

        const messages = convertContent(content);

        const translate = (key) => {
            if (typeof key !== 'string') {
                return '';
            }
            return messages[key];
        };

        return <Wrappee translate={translate} currentLanguage={locale} {...props} />;
    };

    return Index;
};

const convertContent = (transObject, keys = [], result = {}, locale) => {
    if (!transObject) {
        return result;
    }
    Object.entries(transObject).forEach(([key, value]) => {
        const newKeys = [...keys, key];
        if (Array.isArray(value)) {
            const trans = locale === 'da' ? value[1] : value[0];
            result[newKeys.join('.')] = trans;
            return result;
        }
        return convertContent(value, newKeys, result, locale);
    });

    return result;
};

export default addTranslate;
