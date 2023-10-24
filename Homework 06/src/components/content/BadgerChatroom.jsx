import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, Form, Pagination } from "react-bootstrap"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext"
import BadgerMessage from "./BadgerMessage"

export default function BadgerChatroom(props) {
    const [messages, setMessages] = useState([]);
    const user = useContext(BadgerLoginStatusContext);
    const [page, setPage] = useState(1);
    const title = useRef();
    const content = useRef();

    const loadMessages = () => {
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}&page=1`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            setMessages(json.messages)
        })
    };

    const buildPaginator = () => {
        const itemsPerPage = 25;
        const numPages = Math.ceil(messages.length / itemsPerPage);
        const pages = [];

        pages.push(
            <Pagination.Prev 
                key="previous" 
                disabled={page === 1 || messages.length === 0}
                onClick={() => setPage(prevPage => Math.max(1, prevPage - 1))} 
            />
        );
    
        for (let i = 1; i <= numPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={page === i} onClick={() => setPage(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        pages.push(
            <Pagination.Next 
                key="next" 
                disabled={page === numPages || messages.length === 0}
                onClick={() => setPage(prevPage => Math.min(numPages, prevPage + 1))}
            />
        );
    
        return pages;
    };


    const createPost = e => {
        e.preventDefault();

        if (!(title && content)) {
            alert("You must provide both a title and content!");
        } else {
            fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "X-CS571-ID": CS571.getBadgerId(),
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    title: title.current.value,
                    content: content.current.value
                })
            })
            .then(res => {
                if (res.status === 401) {
                    throw new Error("You must be logged in to post!");
                }
                alert("Successfully posted!");
                loadMessages();
            })
            .catch(err => alert(err.message));

            title.current.value = '';
            content.current.value = '';
        }
    }

    const deletePost = id => {
        fetch(`https://cs571.org/api/f23/hw6/messages?id=${id}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                "X-CS571-ID": CS571.getBadgerId(),
                "Content-Type": "application/json"
            }
        }).then(res => {
            console.log(res)
            alert("Successfully deleted the post!")
            loadMessages();
        })
    }


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props]);

    return <>
        <h1>{props.name} Chatroom</h1>
        {
            /* TODO: Allow an authenticated user to create a post. */
            user ?
                <Form onSubmit={createPost}>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="title">Post Title</Form.Label>
                        <Form.Control
                            type="text"
                            ref={title}
                            id="title"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label htmlFor="content">Post Content</Form.Label>
                        <Form.Control
                            type="text"
                            ref={content}
                            id="content"
                        />
                    </Form.Group>

                    <Button type="submit">Create Post</Button>
                </Form>
                :
                <p>You must be logged in to post!</p>
        }
        <hr/>
        {
            messages.length > 0 ?
                <>
                    {
                        /* TODO: Complete displaying of messages. */
                        messages.map(message => 
                            <BadgerMessage key={message.id} {...message} user={user} deletePost={deletePost} />)
                    }
                </>
                :
                <>
                    <p>There are no messages on this page yet!</p>
                </>
        }
        <Pagination className="mt-4">
            {buildPaginator()}
        </Pagination>
    </>
}
