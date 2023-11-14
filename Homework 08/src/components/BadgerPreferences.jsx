import { useState, useContext } from 'react';
import { BadgerPreferencesContext } from './BadgerPreferencesContext';

export const usePreferences = () => useContext(BadgerPreferencesContext);

export const PreferencesProvider = ({ children }) => {
    const [prefs, setPrefs] = useState({});
    return (
        <BadgerPreferencesContext.Provider value={{ prefs, setPrefs }}>
            {children}
        </BadgerPreferencesContext.Provider>
    );
};