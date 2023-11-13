import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function BadgerNewsItemCard({ article }) {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
            style={styles.card}
            onPress={() => navigation.navigate('Article', { articleId: article.fullArticleId })}
        >
            <Image 
                style={styles.image} 
                source={{ uri: `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${article.img}` }} 
            />
            <Text style={styles.title}>{article.title}</Text>
        </TouchableOpacity>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        margin: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
    image: {
        width: '100%',
        height: 200,
        borderRadius: 8,
    },
});

export default BadgerNewsItemCard;