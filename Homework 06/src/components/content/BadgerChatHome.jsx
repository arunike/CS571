import React, { memo } from "react"

function BadgerChatHome () {
    return <>
        <h1>Welcome to BadgerChat!</h1>
        <p>Please be mindful about what you post, this is a chat server shared by every student in CS571.</p>
        <p>As a result, you may see others' posts appear while you are working, this is perfectly normal!</p>
        <p>All content that you post can be linked back to you through your Badger ID.</p>
        <p>Click on a link to get started.</p>
    </>
}

export default memo(BadgerChatHome);
