# update messages when a chat is selected
## 
    You’re missing one connection: the sidebar knows which chat was clicked, but the main content doesn’t. You need:

    A “currentSessionId” state in HomeMock.

    A way for SideNav to tell HomeMock which session was selected.

    A function in HomeMock that fetches messages by sessionId and calls setMessages.

    Also: use sessionId (your UUID) as the logical ID for grouping messages, not the Mongo _id. _id is just for React keys.
    
# sending message without creating chat does not create a session.

# login page