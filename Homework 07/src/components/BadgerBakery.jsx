import { Text, View, Button, Alert, StyleSheet } from "react-native";
import BadgerBakedGood from "./BadgerBakedGood";
import React, { useState, useEffect } from 'react';

import CS571 from '@cs571/mobile-client'

export default function BadgerBakery() {
    const [bakeryItems, setBakeryItems] = useState({});
    const [currentKey, setCurrentKey] = useState('');
    const [cart, setCart] = useState({});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        fetch('https://cs571.org/api/f23/hw7/goods', {
            method: 'GET',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
            },
        })
        .then((res) => res.json())
        .then((json) => {
            setBakeryItems(json);
            setCurrentKey(Object.keys(json)[0]);
            setLoaded(true);
        });
    }, []);

    const goToPrevItem = () => {
        const currentIndex = Object.keys(bakeryItems).indexOf(currentKey);
        if (currentIndex > 0) {
            setCurrentKey(Object.keys(bakeryItems)[currentIndex - 1]);
        }
    };

    const goToNextItem = () => {
        const currentIndex = Object.keys(bakeryItems).indexOf(currentKey);
        if (currentIndex < Object.keys(bakeryItems).length - 1) {
            setCurrentKey(Object.keys(bakeryItems)[currentIndex + 1]);
        }
    };

    const addItemToCart = (itemKey) => {
        const updatedQuantity = (cart[itemKey] || 0) + 1;
        setCart({ ...cart, [itemKey]: updatedQuantity });
    };
    
    const removeItemFromCart = (itemKey) => {
        const updatedQuantity = (cart[itemKey] || 0) - 1;
        if (updatedQuantity <= 0) {
            const newCart = { ...cart };
            delete newCart[itemKey];
            setCart(newCart);
        } else {
            setCart({ ...cart, [itemKey]: updatedQuantity });
        }
    };

    const calcTotal = () => {
        return Object.entries(cart).reduce(
            (total, [key, quantity]) => total + quantity * bakeryItems[key].price,
            0
        );
    };

    const submitOrder = () => {
        const totalCost = calcTotal();
        const numItems = Object.values(cart).reduce((sum, quantity) => sum + quantity, 0);
        Alert.alert('Order Confirmed!', `Your order contains ${numItems} items and costs $${totalCost.toFixed(2)}!`);
        setCart({});
        setCurrentKey(Object.keys(bakeryItems)[0]);
    };

    const keys = Object.keys(bakeryItems);
    const currentIndex = keys.indexOf(currentKey);
    const hasNext = currentIndex < keys.length - 1;
    const hasPrev = currentIndex > 0;

    if (!loaded) {
        return <Text>Loading...</Text>;
    }

    const currentItem = bakeryItems[currentKey];
    const currentQuantity = cart[currentKey] || 0;
    const canDecrease = currentQuantity > 0;
    const canIncrease = currentItem.upperLimit === -1 || currentQuantity < currentItem.upperLimit;

    return <View style={styles.centeredContent}>
        <Text style={{ alignSelf: 'center' }}>Welcome to Badger Bakery!</Text>
            <View style={styles.button}>
                <Button onPress={goToPrevItem} title="PREV" disabled={!hasPrev} />
                <Button onPress={goToNextItem} title="NEXT" disabled={!hasNext} />
            </View>
            <BadgerBakedGood key={currentKey} {...currentItem} />
            <View style={styles.button}>
                <Button disabled={!canDecrease} onPress={() => removeItemFromCart(currentKey)} title="-" />
                <Text>{currentQuantity}</Text>
                <Button disabled={!canIncrease} onPress={() => addItemToCart(currentKey)} title="+" />
            </View>
            <Text style={{ alignSelf: 'center' }}>Order Total: ${calcTotal().toFixed(2)}</Text>
            <Button onPress={submitOrder} title="PLACE ORDER" disabled={calcTotal() === 0} />
    </View>
}

const styles = StyleSheet.create({
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 15,
    },
    centeredContent: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
    },
});