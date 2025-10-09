from dotenv import load_dotenv
from flask import Flask, request, jsonify
from flask_cors import CORS
from openai import OpenAI
import os
from pathlib import Path
from chatDatabase import ChatDatabase

app = Flask(__name__)
CORS(app) #allow requests from my Next.js dev server

db = ChatDatabase()

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
makes a list of the first ten documents in the chatsColl collection
'''
def chatList():
    docsArray = []
    for i, docs in enumerate(db.chatsColl.find({}, {"_id": 0}).sort("_id", -1)):
        if i >= 3:
            break
        docsArray.append(docs)
        
    print(docsArray)
    return docsArray

'''
main chat method gets called when user sends input for page.tsx and posts json reply to be added to a <ChatBubble>
'''
@app.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    user_input = data.get("message", "").strip()

    if not user_input:
        return jsonify({"reply": "I didn't receive any text."}), 400  
    
    #call openAI
    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages= [{"role": "system", "content": "You are a helpful assistant."}] + chatList() +
            [{"role": "user", "content": user_input}]
    )

    reply = resp.choices[0].message.content

    db.chatsColl.insert_one({"role": "user", "content": user_input}) # adds the users input to the collection
    db.chatsColl.insert_one({"role": "assistant", "content": reply}) # adds the response to the collection
    
    return jsonify({"reply": reply})



@app.route("/", methods=["GET"])
def home():
    return jsonify({"status": "Flask API Running", "endpoints": "[/chat (POST)]"})



if __name__ == "__main__":
    app.run(host="127.0.0.1", port=8080, debug=True)
