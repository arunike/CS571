import { Alert, Button, StyleSheet, Text, View, TouchableOpacity } from "react-native";

function BadgerConversionScreen(props) {

    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Ready to signup?</Text>
        <Text>Join BadgerChat to be able to make posts!</Text>
        <Text/>
        <TouchableOpacity style={[styles.signupButton]} onPress={() => props.setIsRegistering(true)}>
            <Text style={styles.buttonText}>Signup</Text>
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
    signupButton: {
        alignItems: "center",
        backgroundColor: "black",
        padding: 10,
        borderRadius: 5,
        width: '40%',
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default BadgerConversionScreen;