import React, { useContext, useEffect, useRef, useState } from "react"
import { Button, Form, Pagination, Container, Row, Col } from "react-bootstrap"
import BadgerLoginStatusContext from "../contexts/BadgerLoginStatusContext"
import BadgerMessage from "./BadgerMessage"

export default function BadgerChatroom(props) {
    const [messages, setMessages] = useState([]);
    const user = useContext(BadgerLoginStatusContext);
    const [page, setPage] = useState(1);
    const title = useRef();
    const content = useRef();
    const maxPages = 4;

    const loadMessages = () => {
        fetch(`https://cs571.org/api/f23/hw6/messages?chatroom=${props.name}&page=${page}`, {
            headers: {
                "X-CS571-ID": CS571.getBadgerId()
            }
        }).then(res => res.json()).then(json => {
            if (json.messages) {
                setMessages(json.messages);
            } else {
                setMessages([]);
            }
        }).catch(err => {
            console.error("Error loading messages:", err);
            setMessages([]);
        });
    };

    const handlePageChange = newPage => {
        const pageNumber = Number(newPage);
        if (!isNaN(pageNumber) && pageNumber >= 1 && pageNumber <= maxPages) {
            setPage(pageNumber);
        }
    };

    const buildPaginator = () => {
        const pages = [];

        pages.push(
            <Pagination.Prev 
                key="previous" 
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)} 
            />
        );

        for (let i = 1; i <= maxPages; i++) {
            pages.push(
                <Pagination.Item key={i} active={page === i} onClick={() => handlePageChange(i)}>
                    {i}
                </Pagination.Item>
            );
        }

        pages.push(
            <Pagination.Next 
                key="next" 
                disabled={page === maxPages}
                onClick={() => handlePageChange(page + 1)}
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
            if (res.ok) {
                alert("Successfully deleted the post!");
                loadMessages();
            } else {
                throw new Error("Failed to delete the post.");
            }
        }).catch(err => alert(err.message));
    };


    // Why can't we just say []?
    // The BadgerChatroom doesn't unload/reload when switching
    // chatrooms, only its props change! Try it yourself.
    useEffect(loadMessages, [props, page]);

    return <Container>
        <Row>
            <Col xs={12}>
                <h1>{props.name} Chatroom</h1>
                {/* TODO: Allow an authenticated user to create a post. */}
                {user ? (
                    <Form onSubmit={createPost}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="title">Post Title</Form.Label>
                            <Form.Control type="text" ref={title} id="title" />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="content">Post Content</Form.Label>
                            <Form.Control type="text" ref={content} id="content" />
                        </Form.Group>
                        <Button type="submit">Create Post</Button>
                    </Form>
                ) : (
                    <p>You must be logged in to post!</p>
                )}
            </Col>
        </Row>

        <Row>
            {messages.length > 0 ? messages.map(message => (
                /* TODO: Complete displaying of messages. */
                <Col key={message.id} xs={12} sm={6} md={6} lg={4} xl={4}>
                    <BadgerMessage {...message} user={user} deletePost={deletePost} />
                </Col>
            )) : (
                <Col xs={12}>
                    <p>There are no messages on this page yet!</p>
                </Col>
            )}
        </Row>

        <Row>
            <Col xs={12}>
                <Pagination className="mt-4 justify-content-center">
                    {buildPaginator()}
                </Pagination>
            </Col>
        </Row>
    </Container>
}
