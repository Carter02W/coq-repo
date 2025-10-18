from pymongo import MongoClient
import uuid

class ChatDatabase:
    def __init__(self, uri="mongodb://localhost:27017/", db_name="coqDB"):
        self.client = MongoClient(uri)
        self.db = self.client[db_name]
        self.chatsColl = self.db["chats"]
        self.sessionId = str(uuid.uuid4())

    def find_docs(self):
        chatsArray = []
        for chats in self.chatsColl.find():
            chatsArray.append(chats)
        # print(chatsArray)

    def add_message(self, role, content): # finish later
        self.chatsColl.insert_one({ "sessionId": self.sessionId, "role": role, "content": content})

    def print_docs(self):
        for chats in self.chatsColl.find():
            print(chats)