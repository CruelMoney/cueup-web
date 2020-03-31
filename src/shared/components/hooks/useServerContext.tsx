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
};

const ServerContext = createContext({ environment: initialEnvironment });

export const useServerContext = () => {
    const { environment } = useContext(ServerContext);
    return { environment };
};

export const ServerContextProvider = ({ children, environment }) => {
    return <ServerContext.Provider value={{ environment }}>{children}</ServerContext.Provider>;
};
