# notes: 
## should there be a saved array of chats/sessions that is just updated when needed instead of listChats and createChats makeing a new list each time? 

from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from pathlib import Path
from datetime import datetime
from messageDatabase import MessageDatabase
from sessionDatabase import SessionDatabase

app = Flask(__name__)
CORS(app) #allow requests from my Next.js dev server

sessionDB = SessionDatabase()
messageDB = MessageDatabase()


if sessionDB.session_id:
    print("session_id =" + sessionDB.session_id)

else:
    print("no session Id")


'''
gets the absolute path of the current (__file__) with .resolve, then runs through each parent and adds /.env.local to it, 
if that path actually exists then it uses that correct path for the load_dotenv path.
'''
env_path = Path(__file__).resolve() #resolves the absolute path (not just the path of where this variable sits) of the current file (__file__) that im in. ex C:/Users/../../test/test-api.py
for parent in env_path.parents:
    candidate = parent/".env.local" # this goes through each parent and adds /.env.local to it

    if candidate.exists():
        load_dotenv(dotenv_path=candidate)  # take environment variables from .env.local
        print("loaded", candidate)
        break


apiKey = os.getenv("OPENAI_API_KEY")
print("api key found?", bool(apiKey)) # quick check that api key is found

client = OpenAI(api_key= apiKey)

'''
makes a list of the first ten documents in the chatsColl collection used from api memory
'''
def messageMemoryList(sessId): #working properly (next add a more advanced memory method)
    docsArray = []
    for i, docs in enumerate(messageDB.messagesColl.find({"sessionId": sessId}, {"_id": 0, "sessionId": 0, "created_at": 0}).sort("_id", -1)):
        if i >= 10:
            break

        # Convert datetime fields to ISO format strings
        for key, value in docs.items():
            if isinstance(value, datetime):
                docs[key] = value.isoformat()

        docsArray.append(docs)

    print("messageMemory: " + str(docsArray))
    return docsArray


'''this function creates a list of messages associated with the chat sessionId given'''
@app.route("/listMessages", methods=["POST"])
def listMessages():
    data = request.get_json(force=True)
    print("\nlistMesage data: " + str(data))

    currSessionId = data.get("sessionId", "").strip()

    print("listMessage currSessionId: " + str(currSessionId))

    messagesArray= []
    for i, message in enumerate(messageDB.messagesColl.find({"sessionId": currSessionId}, {"_id": 0, "created_at": 0}) ): #.sort("_id", -1)
        if i < 10:
            messagesArray.append(message)

    print("listMessages messagesArray:" + str(messagesArray) + "\n")

    return messagesArray




'''
main chat method gets called when user sends input for page.tsx and posts json reply to be added to a <ChatBubble>
'''
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    user_input = data.get("message", "").strip()
    currSession = data.get("sessionId", "").strip() 
    print("chat recieved current session: " + str(currSession) + "\n")

    if not user_input:
        return jsonify({"reply": "I didn't receive any text."}), 400  

    #call openAI
    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages= [{"role": "system", "content": "You are concise and to the point."}] + messageMemoryList(currSession) +
            [{"role": "user", "content": user_input}]
    )

    reply = resp.choices[0].message.content

    messageDB.add_message("user", user_input, currSession) # adds the users input to the collection
    messageDB.add_message("assistant", reply, currSession) # adds the response to the collection


  
    
    print("\n \n" + str(sessionDB.find_sessions()) + "\nCurrent Session = " + str(currSession) + "\nUser Input = " + user_input +"\n")

    #renaming 
    session_doc = sessionDB.sessionsColl.find_one(
        {"session_id": currSession},
        {"title": 1}  # projection: only need the title
    )

    if session_doc and session_doc.get("title") == "New chat":
        newTitle = chatTitle(user_input)
        sessionDB.update_session(currSession, newTitle)
        print("\nupdate triggered")


    
    return jsonify({"reply": reply})



'''this will be called to summarize first message to create a title '''
def chatTitle(user_message):
    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": "Summarize this into a concise title in no more than 5 words."
            },
            {
                "role": "user",
                "content": user_message
            }
        ]
    )

    title = str(resp.choices[0].message.content)
    print("\n\n" + title + "\n")

    return title


'''populates a list of chats''' # this could be where I update the title if there are messages associated with the session? 
@app.route("/listChats", methods=["GET"])
def listChats():
    sessionsArray = []
    for sessions in sessionDB.find_sessions():
        sessions["_id"] = str(sessions["_id"])
        sessionsArray.insert(0, sessions)


    return sessionsArray


""" this function will create a new session and then return a list of sessions and their Ids"""
@app.route("/createChat", methods=["GET"])
def createChat():
    sessionDB.create_session() 
    sessionsArray = jsonify(listChats())
    print(sessionsArray)

    return sessionsArray





@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Flask API Running", "endpoints": "[/chat (POST)]"})



if __name__ == "__main__":
    try:
        app.run(host="127.0.0.1", port=8080, debug=True, use_reloader=False)
    finally:
        # close DB clients on shutdown (see #2)
        messageDB.client.close()
        sessionDB.client.close()