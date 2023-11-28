import { StyleSheet, Text, View } from "react-native";

function BadgerLandingScreen(props) {
    return <View style={styles.container}>
        <Text style={{fontSize: 24, marginTop: -100}}>Welcome to BadgerChat!</Text>
        <Text>Navigate to a chatroom via the drawer to get started.</Text>
    </View>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    }
});

export default BadgerLandingScreen;