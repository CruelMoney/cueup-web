import emailValidator from 'email-validator';

export function required(value, errorMsg) {
    if (Array.isArray(value)) {
        return !value.length ? 'At least 1 option should be selected' : null;
    }
    return !value && value !== 0 ? 'This field cannot be empty' : null;
}

export function lastName(value) {
    return value && !value.split(' ')[1] ? 'Please enter your last name' : null;
}

export const minLength = (len) => (str) => {
    return str && str.length < len ? `Must be ${len} or more characters` : null;
};

export function email(value) {
    return value && !emailValidator.validate(value) ? 'This email address is invalid' : null;
}

export const matches = (str) => (str2) => {
    return str !== str2 ? 'Not equal' : null;
};

const urlMatchers = () => [
    /(?:(ftp|http|https)?:\/\/)?[w{2:4}]?(?:[\w-]+\.)+([a-z]|[A-Z]|[0-9]){2,6}/gi,
];

const numberMatchers = () => [/(\+)?(?:[0-9]\s*){8,}/gi];

const emailMatchers = () => [
    /[A-Z0-9._%+-]+(\s*(at|@)\s*|\s*[[|{|(]+\s*(at|@)\s*[)|}\]]+\s*)([A-Z0-9.-]+\s*(\.|\s*[[|{|(]*\s*(dot|\.)\s*[)|}|\]]*\s*))+\s*[a-z]{2,6}/gi,
];

const instaMatchers = () => [/((instagram)|(insta(\W){1}))/gi];

export const containsNumber = (message = 'Cannot contain phone numbers') => (value) => {
    if (numberMatchers().some((m) => m.test(value))) {
        return message;
    }
    return null;
};

export const containsEmail = (message = 'Cannot contain emails') => (value) => {
    if (emailMatchers().some((m) => m.test(value))) {
        return message;
    }
    return null;
};

export const containsURL = (message = 'Cannot contain phone URLs') => (value) => {
    if (urlMatchers().some((m) => m.test(value))) {
        return message;
    }
    return null;
};

export const containsInstagram = (message = 'Cannot contain Instagram handle') => (value) => {
    if (instaMatchers().some((m) => m.test(value))) {
        return message;
    }
    return null;
};
