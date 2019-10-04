/* eslint-disable import/first */
import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import { HelmetProvider } from 'react-helmet-async';
import ReactModal from 'react-modal';
import App from '../shared/App';
import store from '../shared/store';
import IntlProvider from '../shared/i18n/IntlProvider';
import ApolloProvider from './ApolloProvider';

ReactModal.setAppElement('#app');

class MyRouter extends Component {
    render() {
        return (
            <ApolloProvider>
                <Router>
                    <IntlProvider>
                        <HelmetProvider>
                            <App />
                        </HelmetProvider>
                    </IntlProvider>
                </Router>
            </ApolloProvider>
        );
    }
}

const BrowserRouter = (props) => (
    <Provider store={store}>
        <MyRouter {...props} />
    </Provider>
);

export default BrowserRouter;
