import './polyfills';

import React from 'react';
import { hydrate, render } from 'react-dom';
import { loadableReady } from '@loadable/component';
import * as serviceWorker from './ServiceWorker';
import Router from './BrowserRouter';

import './i18next';
// import { getCLS, getFID, getLCP } from 'web-vitals';

// getCLS(console.log, true);
// getFID(console.log); // Does not take a `reportAllChanges` param.
// getLCP(console.log, true);

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
serviceWorker.unregister();
