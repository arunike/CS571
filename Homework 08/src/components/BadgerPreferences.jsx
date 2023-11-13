import { createContext, useState, useContext } from 'react';

const PreferencesContext = createContext();

export const usePreferences = () => useContext(PreferencesContext);

export const PreferencesProvider = ({ children }) => {
    const [prefs, setPrefs] = useState({});
    return (
        <PreferencesContext.Provider value={{ prefs, setPrefs }}>
            {children}
        </PreferencesContext.Provider>
    );
};