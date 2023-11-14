import { Text, View, ScrollView } from "react-native";
import React, { useState, useEffect, useContext } from 'react';
import BadgerNewsItemCard from '../BadgerNewsItemCard';
import { BadgerPreferencesContext } from '../BadgerPreferencesContext';

function BadgerNewsScreen(props) {
    const { prefs, articles } = useContext(BadgerPreferencesContext);
    const [filteredArticles, setFilteredArticles] = useState([]);

    useEffect(() => {
        const filtered = articles.filter(article => 
            article.tags.every(tag => prefs[tag] !== false)
        );
        setFilteredArticles(filtered);
    }, [prefs, articles]);
    
    return <ScrollView>
        {filteredArticles.map(article => (
            <BadgerNewsItemCard key={article.id} article={article} />
        ))}
    </ScrollView>
}

export default BadgerNewsScreen;