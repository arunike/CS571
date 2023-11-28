# CS571 F23 HW9 API Documentation

## At a Glance

All routes are relative to `https://cs571.org/api/f23/hw9/`

| Method | URL | Purpose | Return Codes |
| --- | --- | --- | --- |
| `GET`| `/chatrooms` | Get all chatrooms. | 200, 304 |
| `GET` | `/messages?chatroom=NAME&page=NUM`| Get latest messages for specified chatroom and page. | 200, 400, 404 |
| `POST` | `/messages?chatroom=NAME` | Posts a message to the specified chatroom. | 200, 400, 404, 413 |
| `DELETE` | `/messages?id=ID` | Deletes the given message. | 200, 400, 401, 404 |
| `POST` | `/register` | Registers a user account. | 200, 400, 409, 413  |
| `POST` | `/login` | Logs a user in. | 200, 400, 401 |
| `GET` | `/whoami` | Gets details about the currently logged in user. | 200 |

An unexpected server error `500` or "hung" response *may* occur during any of these requests. It is likely to do with your request. Make sure that you have included the appropriate headers and, if you are doing a POST, that you have a properly formatted and stringified JSON body. If the error persists, please contact a member of the course staff.

Make sure to include an `Authorization` and/or `Content-Type` header where appropriate. A valid `X-CS571-ID` must be included with each request, otherwise you will recieve a `401` in addition to any of the errors described below.

## In-Depth Explanations

### Getting all Chatrooms
`GET` `https://cs571.org/api/f23/hw9/chatrooms`

A `200` (new) or `304` (cached) response will be sent with the list of all chatrooms.

```json
[
    "Bascom Hill Chatters",
    "Memorial Union Hangout",
    "Lake Mendota Viewpoint",
    "State Street Strollers",
    "Camp Randall Roar",
    "Aldo Leopold Nature Talks",
    "Wisconsin State Capitol Debates",
    "Monona Terrace Meetups",
    "Henry Vilas Zoo Enthusiasts",
    "Chazen Art Appreciation"
]
```

### Getting Messages for Chatroom

`GET` `https://cs571.org/api/f23/hw9/messages?chatroom=CHATROOM_NAME&page=PAGE_NUM`

There is no get all messages; you must get messages for a particular `chatroom`. **All messages are public**, you do *not* need to be logged in to access them. Furthermore, a `page` may be specified. Each `page` contains up to 25 messages, and there are up to 4 pages. Messages made over 100 messages ago are no longer accessible via the API. A `200` (new) or `304` (cached) response will be sent with messages organized from most recent to least recent. Note that the `created` field is in a ISO 8601 format.

```json
{
    "msg": "Successfully got the latest messages!",
    "page": 1,
    "messages": [
        {
            "id": 2,
            "poster": "acct123",
            "title": "Where is everyone??",
            "content": "Is this assignment released yet?",
            "chatroom": "Bascom Hill Chatters",
            "created": "2023-10-14T21:06:15.000Z"
        },
        {
            "id": 1,
            "poster": "acct123",
            "title": "Hello! 👋",
            "content": "Welcome to BadgerChat! 🦡",
            "chatroom": "Bascom Hill Chatters",
            "created": "2023-10-14T20:48:53.000Z"
        }
    ]
}
```

If an invalid page number is specified, a `400` will be returned.

```json
{
    "msg": "A page number must be between 1 and 4."
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

### Registering a User
`POST` `https://cs571.org/api/f23/hw9/register`

You must register a user with a specified `username` and `password`. 

Requests must include a header `Content-Type: application/json`.

**Example Request Body**

```json
{
    "username": "Test124567",
    "password": "p@ssw0rd1"
}
```

If the registration is successful, the following `200` will be sent...
```json
{
    "msg": "Successfully authenticated.",
    "user": {
        "id": 4,
        "username": "Test124567"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJUZXN0MTI0NTY3IiwiaWF0IjoxNjk5NTQyODYzLCJleHAiOjE2OTk1NDY0NjN9.mMTUjX6bvCLgNebJQO1iXt-ge5lFNbo9bxwfp0U6NhU",
    "eat": 1699546463
}
```

The provided token is an irrevocable JWT that will be valid for **1 hour**. You will need this token in order to create and delete posts.

`eat` specifies the time (as seconds since epoch) when the provided `token` will expire.

If you forget to include a `username` or `password`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'username' and 'password'"
}
```

If a user by the requested `username` already exists, the following `409` will be sent...

```json
{
    "msg": "The user already exists!"
}
```

If the `username` is longer than 64 characters or if the `password` is longer than 128 characters, the following `413` will be sent...

```json
{
    "msg": "'username' must be 64 characters or fewer and 'password' must be 128 characters or fewer"
}
```

### Logging in to an Account

`POST` `https://cs571.org/api/f23/hw9/login`

You must log a user in with their specified `username` and `password`.

Requests must include a header `Content-Type: application/json`.

**Example Request Body**

```json
{
    "username": "Test124567",
    "password": "p@ssw0rd1"
}
```

If the login is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully authenticated.",
    "user": {
        "id": 4,
        "username": "Test124567"
    },
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NCwidXNlcm5hbWUiOiJUZXN0MTI0NTY3IiwiaWF0IjoxNjk5NTQyODgyLCJleHAiOjE2OTk1NDY0ODJ9.l72_zNndpjw_-6jCAke43vnu74yBfn_P1F4bw_xNdr4",
    "eat": 1699546482
}
```

The provided token is an irrevocable JWT that will be valid for **1 hour**. You will need this token in order to create and delete posts.

`eat` specifies the time (as seconds since epoch) when the provided `token` will expire.

If you forget the `username` or `password`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'username' and 'password'"
}
```

If the `username` or `password` is incorrect, the following `401` will be sent...

```json
{
    "msg": "That username or password is incorrect!"
}
```

### Posting a Message

`POST` `https://cs571.org/api/f23/hw9/messages?chatroom=CHATROOM_NAME`

Requests must include a header `Authorization: Bearer JWT_TOKEN` where `JWT_TOKEN` is received from the "login" or "register" endpoints.

Requests must also include a header `Content-Type: application/json`.

The `CHATROOM_NAME` must be specified as a query parameter in the URL, and a `title` and `content` in its request body.

**Example Request Body**

```json
{
    "title": "My Test Post",
    "content": "lorem ipsum dolor sit"
}
```

If the post is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully posted message!",
    "id": 37
}
```

If you forget the `title` or `content`, the following `400` will be sent...

```json
{
    "msg": "A request must contain a 'title' and 'content'"
}
```

If authentication fails (such as an expired token), the following `401` will be sent...

```json
{
    "msg": "You must be logged in to do that!"
}
```

If a chatroom is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "The specified chatroom does not exist. Chatroom names are case-sensitive."
}
```

If the `title` is longer than 128 characters or if the `content` is longer than 1024 characters, the following `413` will be sent...
```json
{
    "msg": "'title' must be 128 characters or fewer and 'content' must be 1024 characters or fewer"
}
```

### Deleting a Message
`DELETE` `https://cs571.org/api/f23/hw9/messages?id=MESSAGE_ID`

The `MESSAGE_ID` must be specified as a query parameter in the URL.

Requests must include a header `Authorization: Bearer JWT_TOKEN` where `JWT_TOKEN` is received from the "login" or "register" endpoints.

If the delete is successful, the following `200` will be sent...

```json
{
    "msg": "Successfully deleted message!"
}
```

If authentication fails (such as an expired token), the following `401` will be sent...

```json
{
    "msg": "You must be logged in to do that!"
}
```

If you try to delete another user's post, the following `401` will be sent...

```json
{
    "msg": "You may not delete another user's post!"
}
```

If a message is specified that does not exist, a `404` will be returned.

```json
{
    "msg": "That message does not exist!"
}
```

### Who Am I?
`GET` `https://cs571.org/api/f23/hw9/whoami`

This endpoint will check if a user is logged in and who they claim to be, including when their token was issued and when it will expire in Unix epoch time.

Requests must include a header `Authorization: Bearer JWT_TOKEN` where `JWT_TOKEN` is received from the "login" or "register" endpoints.

There is no request body for this request.

If the user is logged in, the following `200` will be sent...

```json
{
    "isLoggedIn": true,
    "user": {
        "id": 5,
        "username": "test12456",
        "iat": 1697498317,
        "exp": 1697501917
    }
}
```

If the `Authorization` header is invalid or expired, the following `200` will be sent...

```json
{
    "isLoggedIn": false
}
```