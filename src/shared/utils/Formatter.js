const formatter = {
    date: {
        //returns a datetime object as a eu formatted string
        ToEU: function (inputFormat) {
            function pad(s) {
                return s < 10 ? '0' + s : s;
            }
            const d = new Date(inputFormat);
            return [pad(d.getDate()), pad(d.getMonth() + 1), d.getFullYear()].join('/');
        },

        //returns a datetime object as a us formatted string
        ToUS: function (inputFormat) {
            function pad(s) {
                return s < 10 ? '0' + s : s;
            }
            const d = new Date(inputFormat);
            return [pad(d.getMonth() + 1), pad(d.getDate()), d.getFullYear()].join('/');
        },

        //returns a date from a eu formatted date string. DD/MM/YYYY, 28/07/1993 etc.
        FromEUStringToUSDate: function (dateString) {
            if (!dateString) {
                return null;
            }
            const from = dateString.split('/');
            return new Date(from[2], from[1] - 1, from[0]);
        },

        ToTime: function (date) {
            const addZero = (n) => ('0' + n).slice(-2);
            return addZero(date.getHours()) + ':' + addZero(date.getMinutes());
        },
        ToLocalString: function (date) {
            const options = {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
            };
            return date.toLocaleDateString('da-DK', options);
        },
    },

    money: {
        price: (price, currency, locale, smallestUnit = true) =>
            parseFloat((smallestUnit ? price / 100 : price) || 0).toLocaleString(locale, {
                currency,
                currencyDisplay: 'symbol',
                style: 'currency',
                minimumFractionDigits: currency === 'IDR' ? 0 : 2,
                maximumFractionDigits: currency === 'IDR' ? 0 : 2,
            }),
    },

    name: {
        GetFirstAndLast: function (name) {
            if (!name.includes(' ')) {
                return { firstName: name, lastName: '' };
            }
            const firstName = name.substr(0, name.indexOf(' '));
            const lastName = name.substr(name.indexOf(' ') + 1, name.lastIndexOf(''));
            return { firstName: firstName, lastName: lastName };
        },
    },

    cueupEvent: {
        GetStatus: function (statusEnum, translate) {
            switch (statusEnum) {
                case 'INITIAL':
                    return translate('No relevant DJ could be found');

                case 'CANCELLED':
                    return translate('The event is cancelled');

                case 'OFFERING':
                    return translate("Waiting on DJ's to make offers");

                case 'ACCEPTED':
                    return translate("There's an offer");

                case 'CONFIRMED':
                    return translate('The event is confirmed and payed');

                case 'FINISHED':
                    return translate('The event is finished');

                default:
                    return statusEnum;
            }
        },
    },
};

export default formatter;
