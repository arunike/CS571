import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";
import * as SecureStore from 'expo-secure-store';

function BadgerLogoutScreen(props) {
    const handleLogout = () => {
        SecureStore.deleteItemAsync('jwt').then(() => {
            props.onLogout();
        }).catch(error => {
            console.error('Error deleting JWT:', error);
        });
    };

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Are you sure you're done?</Text>
        <Text>Come back soon!</Text>
        <Text/>
        <TouchableOpacity style={[styles.logoutButton]} onPress={handleLogout}>
            <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
    </View>
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
        width: "50%",
        margin: 12,
        borderWidth: 1,
        padding: 10,
    },
    logoutButton: {
        alignItems: "center",
        backgroundColor: "gray",
        padding: 10,
        borderRadius: 5,
        width: '40%',
    },
});

export default BadgerLogoutScreen;