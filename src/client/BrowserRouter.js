/* eslint-disable import/first */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReactModal from 'react-modal';
import { useSSR } from 'react-i18next';
import useExternals from 'External';
import { ServerContextProvider } from 'components/hooks/useServerContext';
import App from '../shared/App';
import ApolloProvider from '../shared/ApolloProvider';

ReactModal.setAppElement('#app');

const BrowserRouter = () => {
    useExternals();

    const { store, initialLanguage } = window.i18nState;
    useSSR(store, initialLanguage);

    return (
        <Router>
            <ServerContextProvider environment={window.__ENVIRONMENT__}>
                <ApolloProvider>
                    <HelmetProvider>
                        <App />
                    </HelmetProvider>
                </ApolloProvider>
            </ServerContextProvider>
        </Router>
    );
};

export default BrowserRouter;
