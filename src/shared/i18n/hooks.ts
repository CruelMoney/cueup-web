import { useIntl } from 'react-intl';

export const useLocaleRoute = () => {
    const { formatMessage, locale } = useIntl();

    return (route) => `/${locale}${formatMessage({ id: route })}`;
};

export const useTranslate = () => {
    const { formatMessage } = useIntl();

    return (key) => `${formatMessage({ id: key })}`;
};
