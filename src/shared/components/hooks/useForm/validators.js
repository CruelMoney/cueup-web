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
