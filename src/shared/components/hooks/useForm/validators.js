import emailValidator from 'email-validator';

export function required(value, errorMsg) {
    if (Array.isArray(value)) {
        return !value.length ? ['At least 1 option should be selected'] : [];
    }
    return !value && value !== 0 ? ['This field cannot be empty'] : [];
}

export function lastName(value) {
    return value && !value.split(' ')[1] ? ['Please enter your last name'] : [];
}

export function minLength(str) {
    return str && str.length < 6 ? ['Password must be 6 or more characters'] : [];
}

export function email(value) {
    return value && !emailValidator.validate(value) ? ['This email address is invalid'] : [];
}
