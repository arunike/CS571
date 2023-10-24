import React from "react"
import { Card, Button } from "react-bootstrap";

function BadgerMessage(props) {
    const dt = new Date(props.created);
    const isLoggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    const loggedInUser = sessionStorage.getItem("loggedInUser");
    console.log("Retrieved username in BadgerMessage:", loggedInUser);

    const handleDelete = () => {
        props.deletePost(props.id);
    }

    return <Card style={{margin: "0.5rem", padding: "0.5rem"}}>
        <h2>{props.title}</h2>
        <sub>Posted on {dt.toLocaleDateString()} at {dt.toLocaleTimeString()}</sub>
        <br/>
        <i>{props.poster}</i>
        <p>{props.content}</p>
        
        {isLoggedIn && props.poster === loggedInUser ? 
                (
                <Button variant="danger" onClick={handleDelete}>
                    Delete
                </Button>
            ) : null}
    </Card>
}

export default BadgerMessage;