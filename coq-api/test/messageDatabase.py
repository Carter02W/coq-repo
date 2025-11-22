from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
import os

env_path = Path(__file__).resolve()
for parent in env_path.parents:
    candidate = parent/".env.local"

    if candidate.exists():
        load_dotenv(dotenv_path=candidate)
        print("messageDatabase loaded env path", candidate)
        break

dbUri = os.getenv("MONGODB_ATLAS_CONNECTION")
print("messageDatabase connection found?", bool(dbUri))


class MessageDatabase:
    def __init__(self):
        self.client = MongoClient(dbUri, server_api=ServerApi('1'))
        self.db = self.client["coqDB"]
        self.messagesColl = self.db["messages"] # new messages db to replace chats
        #self.session_db = session_db

    def find_docs(self):
        chatsArray = []
        for chats in self.messagesColl.find():
            chatsArray.append(chats)
            

    def add_message(self, role, content, currSession): # finish later
        sid = currSession
        print("add_message: " + str(sid))

        if not sid:
            raise RuntimeError("No active session_id. Did you call create_session()?")  # helpful guard
    
        self.messagesColl.insert_one({ 
            "sessionId": sid, 
            "role": role, 
            "content": content,
            "created_at": datetime.now()
            })

    def print_docs(self):
        for chats in self.messagesColl.find():
            print(chats)

    def delete_all_messages(self):
        self.messagesColl.delete_many({})