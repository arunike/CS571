import { Text, View, Image, StyleSheet } from 'react-native';
import React from 'react';

export default function BadgerBakedGood(props) {
    const displayUpperBound = props.upperLimit === -1 ? 'unlimited' : props.upperLimit;

    return <View style={styles.container}>
        <Image source={{ uri: props.imgSrc }} style={styles.image} />
            <Text style={styles.name}>{props.name}</Text>
            <Text style={styles.price}>${props.price.toFixed(2)}</Text>
            <Text style={styles.text}>You can order up to {displayUpperBound} units!</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    image: {
        width: 250,
        height: 250,
        marginBottom: 10,
    },
    name: {
        fontSize: 30,
        marginBottom: 5,
    },
    price: {
        fontSize: 17,
        marginBottom: 5,
    },
    text: {
        fontSize: 17,
        textAlign: 'center',
    },
});