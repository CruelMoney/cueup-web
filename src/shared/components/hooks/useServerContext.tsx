import React, {
    createContext,
    useContext,
    createElement,
    useRef,
    useState,
    useEffect,
} from 'react';

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

function useStaticContent() {
    const ref = useRef(null as any);
    const [render, setRender] = useState(typeof window === 'undefined');

    useEffect(() => {
        // check if the innerHTML is empty as client side navigation
        // need to render the component without server-side backup
        const isEmpty = ref.current.innerHTML === '';
        if (isEmpty) {
            setRender(true);
        }
    }, []);

    return [render, ref];
}

export default function StaticContent({ children, element = 'div', ...props }) {
    const [render, ref] = useStaticContent();

    // if we're in the server or a spa navigation, just render it
    if (render) {
        return createElement(element, {
            ...props,
            children,
        });
    }

    // avoid re-render on the client
    return createElement(element, {
        ...props,
        ref,
        suppressHydrationWarning: true,
        dangerouslySetInnerHTML: { __html: '' },
    });
}
