from datetime import datetime
from . import db


class MessageDatabase:
    def __init__(self):
        self.messagesColl = db["messages"] # new messages db to replace message

    def find_docs(self):
        messageArray = []
        for message in self.messagesColl.find():
            messageArray.append(message)
            

    def add_message(self, role, content, currChat): # finish later
        sid = currChat
        print("add_message: " + str(sid))

        if not sid:
            raise RuntimeError("No active chat_id. Did you call create_chat()?")  # helpful guard
    
        self.messagesColl.insert_one({ 
            "chat_id": sid, 
            "role": role, 
            "content": content,
            "created_at": datetime.now()
            })


    def print_docs(self):
        for message in self.messagesColl.find():
            print(message)
            

    def delete_all_messages(self):
        self.messagesColl.delete_many({})