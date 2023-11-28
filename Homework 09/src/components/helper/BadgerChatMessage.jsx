import { Text, StyleSheet, Button, TouchableOpacity } from "react-native";
import BadgerCard from "./BadgerCard"

function BadgerChatMessage(props) {

    const dt = new Date(props.created);
    const { id, isOwnedByUser, onDelete } = props;

    // return <BadgerCard style={{ marginTop: 16, padding: 8, marginLeft: 8, marginRight: 8 }}>
    //     <Text style={{fontSize: 28, fontWeight: 600}}>{props.title}</Text>
    //     <Text style={{fontSize: 12}}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
    //     <Text></Text>
    //     <Text>{props.content}</Text>
    // </BadgerCard>

    return <BadgerCard style={styles.card}>
        <Text style={styles.title}>{props.title}</Text>
        <Text style={styles.meta}>by {props.poster} | Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</Text>
        <Text style={styles.content}>{props.content}</Text>
        {isOwnedByUser && (
            <TouchableOpacity style={[styles.deleteButton]} onPress={() => onDelete(id)}>
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableOpacity>
        )}
    </BadgerCard>
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        borderRadius: 6,
        padding: 16,
        marginVertical: 8,
        marginHorizontal: 16,
        width: 350,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.23,
        shadowRadius: 2.62,
        elevation: 4,
    },
    title: {
        fontWeight: 'bold',
        fontSize: 20,
    },
    meta: {
        fontSize: 12,
        color: 'grey',
    },
    content: {
        fontSize: 16,
    },
    deleteButton: {
        alignItems: "center",
        backgroundColor: "red",
        borderRadius: 5,
        width: '100%',
        marginLeft: 0,
    },
    buttonText: {
        color: "white",
        fontSize: 16
    }
});

export default BadgerChatMessage;