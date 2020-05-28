import React, { createContext, useContext, useState } from 'react';

const defaultState = {
    showBottomPlayer: false,
    setAppState: () => {},
    onDeck: null,
};
export const AppContext = createContext(defaultState);

export const useAppState = () => {
    const state = useContext(AppContext);
    return state;
};

export const ProvideAppState = ({ children }) => {
    const setAppState = (v) => setState((s) => ({ ...s, ...v }));

    const [state, setState] = useState({
        ...defaultState,
        setAppState,
    });

    return <AppContext.Provider value={state}>{children}</AppContext.Provider>;
};
