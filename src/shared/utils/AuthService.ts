import { EventEmitter } from 'events';
import { CustomWindow } from 'global';
import getCookie from './getCookie';

declare let window: CustomWindow;

class AuthService extends EventEmitter {
    setSession(token) {
        console.log('set session');
        // Set the time that the access token will expire at
        localStorage.setItem('token', token);
        const expire = new Date(Date.now() + 12096e5).toUTCString(); // 2 weeks from now
        document.cookie = `x-token=${token}; path=/; expires = ${expire}`;
    }

    logout() {
        this.removeToken();
        window.location.href = window.__ENVIRONMENT__.GQL_DOMAIN + '/logout';
    }

    removeToken() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('token');
        document.cookie = 'x-token=; path=/; expires = Thu, 01 Jan 1970 00:00:00 GMT';
    }

    loggedIn() {
        const token = this.getAccessToken();
        return !!token && token !== 'undefined';
    }

    getAccessToken() {
        // Retrieves the user token from localStorage
        const token = getCookie('x-token') ?? localStorage.getItem('token');
        return token;
    }

    getToken() {
        return this.getAccessToken();
    }
}

export const authService = new AuthService();
