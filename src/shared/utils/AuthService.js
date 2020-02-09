import { EventEmitter } from 'events';
import moment from 'moment';

class AuthService extends EventEmitter {
    setSession(token) {
        console.log('set session');
        // Set the time that the access token will expire at
        localStorage.setItem('token', token);
        const expire = moment()
            .add(2, 'weeks')
            .utc();
        document.cookie = `x-token=${token}; path=/; expires = ${expire}`;
    }

    logout() {
        console.log('log out');

        // Clear access token and ID token from local storage
        localStorage.removeItem('token');
        document.cookie = 'x-token=; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT';
        window.location.href = process.env.REACT_APP_CUEUP_GQL_DOMAIN + '/logout';
    }

    loggedIn() {
        const token = this.getAccessToken();
        return !!token && token !== 'undefined';
    }

    getAccessToken() {
        // Retrieves the user token from localStorage
        const token = getCookie('x-token') ?? localStorage.getItem('token');
        console.log({ token });
        return token;
    }

    getToken() {
        return this.getAccessToken();
    }
}

function getCookie(name) {
    const nameEQ = name + '=';
    const ca = document.cookie.split(';');
    for (let c of ca) {
        while (c.charAt(0) == ' ') {
            c = c.substring(1, c.length);
        }
        if (c.indexOf(nameEQ) == 0) {
            return c.substring(nameEQ.length, c.length);
        }
    }
    return null;
}

export const authService = new AuthService();
