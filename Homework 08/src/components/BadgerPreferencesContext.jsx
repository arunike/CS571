import { createContext } from 'react';

export const BadgerPreferencesContext = createContext({
    prefs: {},
    setPrefs: () => {},
    tags: [],
    setTags: () => {},
    articles: [],
    setArticles: () => {}
});