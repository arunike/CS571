import React from 'react';
import { useState } from 'react';
import { Button, Form } from 'react-bootstrap';

export default function BadgerRegister() {
    // TODO Create the register component.
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        if (username === "" || password === "" || confirmPassword === "") {
            alert("You must provide both a username and password!");
            return;
        }

        if (password !== confirmPassword) {
            alert("passwords do not match");
            return;
        }

        fetch("https://cs571.org/api/f23/hw6/register", {
            method: "POST",
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username,
                password: password
            })
        }).then(handleResponse)
            .then(data => {
                if (data.success) {
                    alert("Registration was successful!");
                } else if (data.msg === "Username taken") {
                    alert("That username has already been taken!");
                } else {
                    alert(data.msg);
                }
            })
            .catch(err => {
                alert(err);
            })

        function handleResponse(res) {
            return res.json().then(json => {
                if (res.ok) {
                    return json;
                } else {
                    return Promise.reject(json.msg);
                }
            })
        }
    }

    return <>
        <h1>Register</h1>
        <Form>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="username">username</Form.Label>
                <Form.Control id="username" type="username" value={username} onChange={(e) => { setUsername(e.target.value) }} />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control id="password" type="password" value={password} onChange={(e) => { setPassword(e.target.value) }} />
            </Form.Group>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="repeatedPassword">Repeat Password</Form.Label>
                <Form.Control id="repeatedPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
            </Form.Group>
            <Button variant="primary" type="submit" onClick={handleSubmit}>
                Submit
            </Button>
        </Form>
    </>
}
