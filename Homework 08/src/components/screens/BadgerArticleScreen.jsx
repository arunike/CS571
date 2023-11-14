import React, { useState, useEffect, useRef } from 'react';
import { View, Text, ScrollView, Animated, StyleSheet, Image, ActivityIndicator, Pressable, Linking } from 'react-native';
import CS571 from '@cs571/mobile-client'

function BadgerArticleScreen(props) {
    const { articleId, title, imageUri } = props.route.params;
    const [article, setArticle] = useState([]);
    const [loading, setLoading] = useState(true);
    const opacityAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        fetch(`https://cs571.org/api/f23/hw8/article?id=${articleId}`, {
            method: 'GET',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
            },
        })
        .then(response => response.json())
        .then(data => {
            setArticle(data);
            setLoading(false);
            Animated.timing(opacityAnim, {
                toValue: 1,
                duration: 2000,
                useNativeDriver: true,
            }).start();
        })
        .catch(error => {
            console.error('Error fetching article:', error);
            setLoading(false);
        });
    }, [articleId, opacityAnim]);

    if (loading) {
        return (
            <ScrollView style={styles.container}>
                <Image 
                    style={styles.images} 
                    source={{ uri: imageUri }}
                />
                <Text style={styles.title}>{title}</Text>
                <ActivityIndicator size="large" color="#3498db" />
                <Text style={styles.loadingText}>The content is loading!</Text>
            </ScrollView>
        );
    }

    const handlePress = () => {
        Linking.openURL(article?.url).catch(err => console.error("Couldn't load page", err));
    };

    return (
        <ScrollView style={styles.container}>
            <Image 
                style={styles.images} 
                source={{ uri: imageUri }}
            />
            <Text style={styles.title}>{title}</Text>
            <Animated.View style={{ opacity: opacityAnim }}>
                <Text style={styles.headerText}>By {article?.author} on {article?.posted}</Text>
                <Pressable onPress={handlePress}>
                    <Text style={styles.linkText}>Read full article here.</Text>
                </Pressable>
                {article?.body?.map((paragraph, index) => (
                    <Text key={index} style={styles.paragraph}>{paragraph}</Text>
                ))}
            </Animated.View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        textAlign: 'center',
        margin: 20,
        color: "#3498db",
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 18,
        marginBottom: 20,
    },
    paragraph: {
        fontSize: 16,
        marginBottom: 20,
    },
    images: {
        width: '100%',
        height: 300,
        borderRadius: 8,
        marginBottom: 20,
    },
    linkText: {
        color: '#3498db',
        fontSize: 16,
        textDecorationLine: 'underline',
        marginBottom: 20,
    },
});

export default BadgerArticleScreen;