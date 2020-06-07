import React, { createContext, useContext, useState } from 'react';

const defaultState = {
    showBottomPlayer: false,
    setAppState: () => {},
    onDeck: null,
    notifications: {},
};
export const AppContext = createContext(defaultState);

export const useAppState = () => {
    const state = useContext(AppContext);
    return state;
};

export const ProvideAppState = ({ children }) => {
    const setAppState = (v) =>
        setState((s) => {
            if (typeof v === 'function') {
                return v(s);
            }

            return { ...s, ...v };
        });

    const [state, setState] = useState({
        ...defaultState,
        setAppState,
    });

    return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
