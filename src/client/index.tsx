import './polyfills';

import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
// import * as serviceWorker from './serviceWorker';
import Router from './BrowserRouter';

import './i18next';

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
