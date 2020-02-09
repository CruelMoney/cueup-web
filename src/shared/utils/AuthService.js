import { EventEmitter } from 'events';
import moment from 'moment';

class AuthService extends EventEmitter {
    setSession(token) {
        // Set the time that the access token will expire at
        localStorage.setItem('token', token);
        const expire = moment()
            .add(2, 'weeks')
            .utc();
        document.cookie = `x-token=${token}; path=/; expires = ${expire}`;
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('token');
        window.location.href = process.env.REACT_APP_CUEUP_GQL_DOMAIN + '/logout';
    }

    loggedIn() {
        const token = this.getAccessToken();
        return !!token && token !== 'undefined';
    }

    getAccessToken() {
        // Retrieves the user token from localStorage
        return localStorage.getItem('token');
    }

    getToken() {
        return this.getAccessToken();
    }
}

export const authService = new AuthService();
