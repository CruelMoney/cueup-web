/* eslint-disable import/first */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReactModal from 'react-modal';
import { useSSR } from 'react-i18next';
import { CookiesProvider } from 'react-cookie';
import useExternals from 'External';
import { ServerContextProvider } from 'components/hooks/useServerContext';
import { CustomWindow } from 'global';
import App from '../shared';
import ApolloProvider from '../shared/ApolloProvider';

ReactModal.setAppElement('#app');

declare let window: CustomWindow;

const BrowserRouter = () => {
    useExternals();

    const { store, initialLanguage } = window.__I18N_STATE__;
    useSSR(store, initialLanguage);

    return (
        <React.StrictMode>
            <CookiesProvider>
                <Router>
                    <ServerContextProvider environment={window.__ENVIRONMENT__} isSSR={false}>
                        <ApolloProvider>
                            <HelmetProvider>
                                <App />
                            </HelmetProvider>
                        </ApolloProvider>
                    </ServerContextProvider>
                </Router>
            </CookiesProvider>
        </React.StrictMode>
    );
};

export default BrowserRouter;
