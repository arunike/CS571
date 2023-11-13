import { NavigationContainer } from '@react-navigation/native';
import { useState, createContext } from 'react';
import BadgerTabs from './navigation/BadgerTabs';

export const PreferencesContext = createContext();

export default function BadgerNews(props) {
  // Just a suggestion for Step 4! Maybe provide this to child components via context...
  const [prefs, setPrefs] = useState({});

  return (
    <PreferencesContext.Provider value={{ prefs, setPrefs }}>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </PreferencesContext.Provider>
  );
}