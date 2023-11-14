import React from 'react';
import { Text, StyleSheet, Image } from 'react-native';
import { Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';

function BadgerNewsItemCard({ article }) {
    const navigation = useNavigation();

    return (
        <Pressable 
        style={styles.card}
        onPress={() => navigation.navigate('Article', { 
            articleId: article.fullArticleId,
            title: article.title,
            imageUri: `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${article.img}`
        })}
    >
            <Image 
                style={styles.image} 
                source={{ uri: `https://raw.githubusercontent.com/CS571-F23/hw8-api-static-content/main/articles/${article.img}` }} 
            />
            <Text style={styles.title}>{article.title}</Text>
        </Pressable>
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