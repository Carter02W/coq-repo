from . import db
from datetime import datetime
import uuid

class ChatDatabase: 
    def __init__(self):
        self.chatsColl = db["chats"]
        self.chat_id = None  # setup, no action yet
        self.title = None

    def create_chat(self, first_message="New chat"):
        self.chat_id = str(uuid.uuid4())
        self.chatsColl.insert_one({
            "chat_id": self.chat_id,
            "title": first_message,
            "created_at": datetime.now()
        })

    def delete_all_chats(self):
        self.chatsColl.delete_many({})

    def find_chats(self):
        chatsArray = []
        for chat in self.chatsColl.find():
            chatsArray.append(chat)
        return chatsArray
    
    def update_chat(self, chat_id, new_title):
        self.chatsColl.update_one(
            {"chat_id": chat_id, "title": "New chat"},
            {"$set": {"title": new_title}}
        )








