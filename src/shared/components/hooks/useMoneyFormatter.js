import useTranslate from 'components/hooks/useTranslate';

const useMoneyFormatter = ({ currency }) => {
    const { currentLanguage } = useTranslate();
    const formatter = new Intl.NumberFormat(currentLanguage, {
        currencyDisplay: 'code',
        style: 'currency',
        minimumFractionDigits: currency === 'IDR' ? 0 : 2,
        maximumFractionDigits: currency === 'IDR' ? 0 : 2,
        currency,
    });

    const format = (value) => {
        if (!value || isNaN(value)) {
            return null;
        }

        return formatter.format(value / 100);
    };

    return format;
};

export default useMoneyFormatter;
