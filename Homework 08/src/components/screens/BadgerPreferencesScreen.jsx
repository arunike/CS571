import { Text, View, TouchableOpacity, Animated, StyleSheet } from "react-native";
import React, { useContext} from 'react';
import { BadgerPreferencesContext } from '../BadgerPreferencesContext';

const CustomSwitch = ({ isOn, onToggle }) => {
    const animatedValue = new Animated.Value(isOn ? 1 : 0);
    const switchBackground = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: ['#ddd', '#4CBB17']
    });

    const knobOffset = animatedValue.interpolate({
        inputRange: [0, 1],
        outputRange: [2, 21]
    });

    return (
        <TouchableOpacity
            onPress={onToggle}
            activeOpacity={0.8}
            style={[styles.switchContainer, { backgroundColor: switchBackground }]}>
            <Animated.View
                style={[
                    styles.switchKnob,
                    { transform: [{ translateX: knobOffset }] }
                ]}
            />
        </TouchableOpacity>
    );
};

function BadgerPreferencesScreen(props) {
    const { prefs, setPrefs, tags } = useContext(BadgerPreferencesContext);

    const toggleSwitch = (tag) => {
        setPrefs({ ...prefs, [tag]: !prefs[tag] });
    };

    return <View style={styles.screenContainer}>
        {tags.map(tag => (
            <View key={tag} style={styles.card}>
                <Text style={styles.tagText}>{tag}</Text>
                <CustomSwitch
                    isOn={prefs[tag]}
                    onToggle={() => toggleSwitch(tag)}
                />
            </View>
        ))}
    </View>
}

const styles = StyleSheet.create({
    screenContainer: {
        flex: 1,
        padding: 10,
        backgroundColor: '#F5F5F5',
        paddingTop: 100,
    },
    card: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 15,
        marginVertical: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    tagText: {
        fontSize: 16,
        color: '#212121'
    },
    switchContainer: {
        width: 44,
        height: 24,
        borderRadius: 12,
        justifyContent: 'center',
        padding: 2,
        borderWidth: 2,
    },
    switchKnob: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: 'white',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 4,
    },
});

export default BadgerPreferencesScreen;