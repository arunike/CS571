import React, { useContext, useRef } from 'react';
import { Form, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import BadgerLoginStatusContext from '../contexts/BadgerLoginStatusContext';

export default function BadgerLogin() {
    // TODO Create the login component.
    const username = useRef();
    const password = useRef();
    const navigate = useNavigate();
    const [loginStatus, setLoginStatus] = useContext(BadgerLoginStatusContext);

    const login = e => {
        e.preventDefault();

        if (!(username.current.value && password.current.value)) {
            alert("You must provide both a username and password!");
            return;
        }

        fetch('https://cs571.org/api/f23/hw6/login', {
            method: 'POST',
            headers: {
                'X-CS571-ID': CS571.getBadgerId(),
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({
                username: username.current.value,
                password: password.current.value
            })
        })
        .then(res => res.json())
        .then(data => {
            if (!data.user) {
                throw new Error(data.msg);
            }
            alert('Login was successful');
            setLoginStatus(true);
            sessionStorage.setItem("isLoggedIn", true);
            sessionStorage.setItem("loggedInUser", data.user.username);
            console.log("Stored username:", sessionStorage.getItem("loggedInUser"));
            navigate('/');
        }).catch(err => {
            alert("Incorrect username or password!");
        })
    }

    return <>
        <h1>Login</h1>
        <Form onSubmit={login}>
            <Form.Group className="mb-3">
                <Form.Label htmlFor="username">Username</Form.Label>
                <Form.Control
                    type="text"
                    ref={username}
                    id="username"
                />
            </Form.Group>

            <Form.Group className="mb-3">
                <Form.Label htmlFor="password">Password</Form.Label>
                <Form.Control
                    type="password"
                    ref={password}
                    id="password"
                />
            </Form.Group>

            <Button type="submit">Login</Button>
        </Form>
    </>
}
