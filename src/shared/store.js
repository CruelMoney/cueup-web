import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import reducers from './reducers/Store';
import commonContent from './constants/content/common.json';
import routesContent from './constants/content/routes.json';

let singletonStore = null;
const isClient = typeof window !== 'undefined';

export const configureStore = (initialState = {}, req) => {
    // Create the store with two middlewares
    const middlewares = [thunkMiddleware];

    if (process.env.NODE_ENV !== 'production' && isClient) {
        middlewares.push(logger);
    }

    const enhancers = [applyMiddleware(...middlewares)];

    const composeEnhancers =
        isClient && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__
            : compose;

    const store = createStore(reducers, initialState, composeEnhancers(...enhancers));

    singletonStore = store;
    return singletonStore;
};

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = isClient ? window.__PRELOADED_STATE__ : {};

// Allow the passed state to be garbage-collected
isClient && delete window.__PRELOADED_STATE__;

export default singletonStore ? singletonStore : configureStore(preloadedState);
