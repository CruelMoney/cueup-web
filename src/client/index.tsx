import React from 'react';
import { hydrate, render } from 'react-dom';
import * as Sentry from '@sentry/browser';
import { loadableReady } from '@loadable/component';
// import * as serviceWorker from './serviceWorker';
import Router from './BrowserRouter';
import './polyfills';

const production = process.env.NODE_ENV === 'production';

if (production) {
    console.log('Initializing Sentry');
    Sentry.init({
        enabled: production,
        dsn: 'https://800ac4dbef6c44bcb65af9fddad9f964@sentry.io/1490082',
        environment: process.env.REACT_APP_CUEUP_DEV_CALLBACK_DOMAIN,
    });
}

const rootElement = document.getElementById('app');
if (rootElement && rootElement.hasChildNodes()) {
    loadableReady().then(() => {
        console.log('hydrating');
        hydrate(<Router />, rootElement);
    });
} else {
    render(<Router />, rootElement);
}

if (process.env.NODE_ENV === 'development') {
    if (module.hot) {
        module.hot.accept();
    }
}
// serviceWorker.register();
