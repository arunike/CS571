import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from 'react';

function BadgerRegisterScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onSignup = () => {
        if (!username || !password || !confirmPassword) {
            Alert.alert("Error", "All fields are required.");

            return;
        }
    
        if (password !== confirmPassword) {
            Alert.alert("Error", "Passwords do not match.");

            return;
        }
    
        props.handleSignup(username, password);
    };

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>Join BadgerChat!</Text>
        <Text>Username</Text>
        <TextInput
                placeholder="Username"
                value={username}
                onChangeText={setUsername}
                style={styles.input}
        />
        <Text>Password</Text>
        <TextInput
            placeholder="Password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            style={styles.input}
        />
        <Text>Confirm Password</Text>
        <TextInput
            placeholder="Confirm Password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
            style={styles.input}
        />
        <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.signupButton]} onPress={onSignup}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.nevermindButton]} onPress={() => props.setIsRegistering(false)}>
                <Text style={styles.buttonText}>Nevermind!</Text>
            </TouchableOpacity>
        </View>
    </View>;
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '80%',
        height: 50,
    },
    signupButton: {
        alignItems: "center",
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        width: '40%',
        marginTop: 10,
        marginRight: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16
    },
    nevermindButton: {
        alignItems: "center",
        backgroundColor: "grey",
        padding: 10,
        borderRadius: 5,
        width: '40%',
        marginTop: 10,
        marginLeft: 5,
    },
});

export default BadgerRegisterScreen;