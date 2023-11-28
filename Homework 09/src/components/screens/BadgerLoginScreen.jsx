import { Alert, Button, StyleSheet, Text, View, TextInput, TouchableOpacity } from "react-native";
import React, { useState } from 'react';

function BadgerLoginScreen(props) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const onLogin = () => {
        if (!username || !password) {
            Alert.alert("Error", "Username and password are required.");
            return;
        }
        
        props.handleLogin(username, password);
    };

    return <View style={styles.container}>
        <Text style={{ fontSize: 36 }}>BadgerChat Login</Text>
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
        <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
            <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.buttonRow}>
            <TouchableOpacity style={[styles.signupButton]} onPress={() => props.setIsRegistering(true)}>
                <Text style={styles.buttonText}>Signup</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.guestButton]} onPress={() => props.handleGuestAccess()}>
                <Text style={styles.buttonText}>Continue As Guest</Text>
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
    loginButton: {
        alignItems: "center",
        backgroundColor: "crimson",
        padding: 10,
        borderRadius: 5,
        width: '30%',
        height: 40,
        marginTop: 10
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
    guestButton: {
        alignItems: "center",
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 5,
        width: '60%',
        marginTop: 10,
        marginLeft: 5,
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default BadgerLoginScreen;