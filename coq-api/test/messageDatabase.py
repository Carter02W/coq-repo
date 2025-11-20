from pymongo import MongoClient
from datetime import datetime

class MessageDatabase:
    def __init__(self, session_db, uri="mongodb://localhost:27017/", db_name="coqDB"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.messagesColl = self.db["messages"] # new messages db to replace chats
        self.session_db = session_db

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