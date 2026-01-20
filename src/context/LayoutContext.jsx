
/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from 'react';

const LayoutContext = createContext();

export const LayoutProvider = ({ children }) => {
    const [isHeaderVisible, setIsHeaderVisible] = useState(true);

    return (
        <LayoutContext.Provider value={{ isHeaderVisible, setIsHeaderVisible }}>
            {children}
        </LayoutContext.Provider>
    );
};

export const useLayout = () => {
    const context = useContext(LayoutContext);
    if (!context) {
        throw new Error('useLayout must be used within a LayoutProvider');
    }
    return context;
};
