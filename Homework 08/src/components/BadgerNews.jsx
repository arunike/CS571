import { NavigationContainer } from '@react-navigation/native';
import { useState, useEffect } from 'react';
import BadgerTabs from './navigation/BadgerTabs';
import { BadgerPreferencesContext } from './BadgerPreferencesContext';
import CS571 from '@cs571/mobile-client'

export default function BadgerNews(props) {
  // Just a suggestion for Step 4! Maybe provide this to child components via context...
  const [prefs, setPrefs] = useState({});
  const [tags, setTags] = useState([]);
  const [articles, setArticles] = useState([]);

  useEffect(() => {
    fetch('https://cs571.org/api/f23/hw8/articles', {
      method: 'GET',
      headers: {
        'X-CS571-ID': CS571.getBadgerId(),
      },
    })
    .then(response => response.json())
    .then(data => {
      const uniqueTags = new Set();

      data.forEach(article => {
        article.tags.forEach(tag => uniqueTags.add(tag));
      });
      setTags(Array.from(uniqueTags));

      const initialPrefs = Array.from(uniqueTags).reduce((acc, tag) => {
        acc[tag] = true;
        return acc;
      }, {});
      
      setPrefs(initialPrefs);
      setArticles(data);
    });
  }, []);

  return (
    <BadgerPreferencesContext.Provider value={{ prefs, setPrefs, tags, setTags, articles, setArticles }}>
      <NavigationContainer>
        <BadgerTabs />
      </NavigationContainer>
    </BadgerPreferencesContext.Provider>
  );
}