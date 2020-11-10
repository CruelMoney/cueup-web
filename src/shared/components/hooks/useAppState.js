import React, { createContext, useContext, useState, useCallback } from 'react';

const defaultState = {
    showBottomPlayer: false,
    setAppState: () => {},
    onDeck: null,
    notifications: {},
    activeChat: null,
    showSideBarChat: false,
    activeEvent: null,
};
export const AppContext = createContext(defaultState);

export const useAppState = () => {
    const state = useContext(AppContext);
    return state;
};

export const ProvideAppState = ({ children }) => {
    const setAppState = useCallback(
        (v) =>
            setState((s) => {
                if (typeof v === 'function') {
                    return v(s);
                }

                return { ...s, ...v };
            }),
        []
    );

    const [state, setState] = useState({
        ...defaultState,
        setAppState,
    });

    return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
