/* eslint-disable import/first */
import React, { Component } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import ReactModal from 'react-modal';
import useExternals from 'External';
import { LocalizedRouter, appStrings } from 'i18n';
import { AppLanguage } from 'i18n/app-languages';
import App from '../shared/App';
import store from '../shared/store';
import ApolloProvider from '../shared/ApolloProvider';

ReactModal.setAppElement('#app');

const MyRouter = () => {
    useExternals();

    return (
        <Provider store={store}>
            <ApolloProvider>
                <LocalizedRouter
                    RouterComponent={BrowserRouter}
                    languages={AppLanguage}
                    appStrings={appStrings}
                >
                    <HelmetProvider>
                        <App />
                    </HelmetProvider>
                </LocalizedRouter>
            </ApolloProvider>
        </Provider>
    );
};

export default MyRouter;
