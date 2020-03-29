/* eslint-disable import/first */
import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import ReactModal from 'react-modal';
import useExternals from 'External';
import App from '../shared/App';
import ApolloProvider from '../shared/ApolloProvider';

ReactModal.setAppElement('#app');

const BrowserRouter = () => {
    useExternals();

    return (
        <ApolloProvider>
            <Router>
                <HelmetProvider>
                    <App />
                </HelmetProvider>
            </Router>
        </ApolloProvider>
    );
};

export default BrowserRouter;
