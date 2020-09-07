import React, { createContext, useContext } from 'react';
import { Environment } from 'global';

const initialEnvironment: Environment = {
    STRIPE_PUBLIC_KEY: null,
    CALLBACK_DOMAIN: null,
    GQL_DOMAIN: null,
    CHAT_DOMAIN: null,
    FACEBOOK_ID: null,
    PIXEL_ID: null,
    GOOGLE_API_KEY: null,
    XENDIT_PUB_KEY: null,
    WEBSITE_URL: null,
    SETTING: 'development',
    ONE_SIGNAL_KEY: null,
    COUNTRY_CODE: null,
};

const initial = {
    environment: initialEnvironment,
    isSSR: false,
    data: {},
};

const ServerContext = createContext(initial);

export const useServerContext = () => {
    const { environment, isSSR, data } = useContext(ServerContext);
    return { environment, isSSR, data };
};

export const ServerContextProvider = ({ children, environment, data, isSSR }) => {
    return (
        <ServerContext.Provider value={{ environment, isSSR, data }}>
            {children}
        </ServerContext.Provider>
    );
};
