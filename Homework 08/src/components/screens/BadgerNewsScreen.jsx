import { Text, View, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import BadgerNewsItemCard from '../BadgerNewsItemCard';
import { PreferencesContext } from '../BadgerNews';
import CS571 from '@cs571/mobile-client'

function BadgerNewsScreen(props) {
    const [articles, setArticles] = useState([]);
    const { prefs } = useContext(PreferencesContext);

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw8/articles', {
            method: 'GET',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
            },
        })
        .then(response => response.json())
        .then(data => {
            setArticles(data);
        })
    }, []);

    const filteredArticles = articles.filter(article => 
        article.tags.every(tag => prefs[tag])
    );
    
    return <ScrollView>
        {filteredArticles.map(article => (
        <BadgerNewsItemCard key={article.id} article={article} />
        ))}
  </ScrollView>
}

export default BadgerNewsScreen;