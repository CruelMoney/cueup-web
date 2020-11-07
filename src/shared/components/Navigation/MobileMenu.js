import React, { useState, createContext, useCallback } from 'react';

const initialContext = {
    registerRoutes: (_routes) => {},
    unregisterRoutes: (_routes) => {},
    routes: [],
    label: null,
};

export const MobileMenuContext = createContext(initialContext);

const compareRoutes = (r1 = [], r2 = [], key = 'route') => {
    // eslint-disable-next-line security/detect-object-injection
    return r1.every((v, idx) => r2[idx] && v[key] === r2[idx][key]);
};
export const ProvideMobileMenu = ({ children }) => {
    const [state, setState] = useState({
        mobileLinks: [],
    });

    const registerMobileLinks = useCallback(
        (routes, mobileLabel) => {
            console.log('register routes');

            setState((state) => {
                const { mobileLinks } = state;
                if (!compareRoutes(routes, mobileLinks)) {
                    let newLinks = mobileLinks.filter(
                        (l) => !routes.map((r) => r.route).includes(l.route)
                    );
                    newLinks = [...newLinks, ...routes];

                    return { ...state, mobileLinks: newLinks, mobileLabel };
                }
                return state;
            });
        },
        [setState]
    );

    const unregisterMobileLinks = useCallback(
        (routes) => {
            setState((state) => {
                const { mobileLinks } = state;
                const newLinks = mobileLinks.filter(
                    (l) => !routes.map((r) => r.route).includes(l.route)
                );
                if (!compareRoutes(mobileLinks, newLinks)) {
                    return {
                        ...state,
                        mobileLinks: newLinks,
                    };
                }
                return state;
            });
        },
        [setState]
    );

    return (
        <MobileMenuContext.Provider
            value={{
                routes: state.mobileLinks,
                unregisterRoutes: unregisterMobileLinks,
                registerRoutes: registerMobileLinks,
                label: state.mobileLabel,
            }}
        >
            {children}
        </MobileMenuContext.Provider>
    );
};
