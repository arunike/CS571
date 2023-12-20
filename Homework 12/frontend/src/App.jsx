import { useEffect, useState } from 'react'
import './App.css'
import { Button, Card, Form } from 'react-bootstrap'

function App() {

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const [messages, setMessages] = useState([])

  const load = () => {
    fetch("http://localhost:53706/api/messages")
    .then(res => res.json())
    .then(data => {
      setMessages(data)
    })
  }

  useEffect(load, [])

  const handlePost = () => {
    fetch("http://localhost:53706/api/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        content: content
      })
    })
    .then(res => {
      if (res.ok) {
        alert("Created post!")
        load();
      } else {
        alert("Something went wrong!")
      }
    })
  }

  const handleDelete = (id) => {
    fetch(`http://localhost:53706/api/messages/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      }
    })
    .then(res => {
      if (res.ok) {
        alert("Deleted post!")
        load();
      } else {
        alert("Something went wrong!")
      }
    })
  }

  return <div>
    <h1>Welcome to BadgerChat Mini!</h1>
    <Form>
      <Form.Label htmlFor='title-inp'>Title</Form.Label>
      <Form.Control id='title-inp' value={title} onChange={(e) => setTitle(e.target.value)}></Form.Control>
      <Form.Label htmlFor='content-inp'>Content</Form.Label>
      <Form.Control id='content-inp' value={content} onChange={(e) => setContent(e.target.value)}></Form.Control>
      <br/>
      <Button onClick={handlePost}>Submit</Button>
    </Form>
    {
      messages.map(m => <Card key={m.id} style={{marginTop: "1rem"}}>
        <h2>{m.title}</h2>
        <p>{m.content}</p>
        <Button onClick={() => handleDelete(m.id)} style={{background: "#FF0000"}}>Delete</Button>
      </Card>
      )
    }
  </div>
}

export default App
