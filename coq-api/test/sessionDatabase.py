from pymongo import MongoClient
from datetime import datetime, timezone
import uuid

class SessionDatabase: 
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["coqDB"]
        self.sessionsColl = self.db["sessions"]
        self.session_id = None  # setup, no action yet
        self.title = None

    def create_session(self, first_message="New chat"):
        self.session_id = str(uuid.uuid4())
        self.sessionsColl.insert_one({
            "session_id": self.session_id,
            "title": first_message,
            "created_at": datetime.now()
        })

    def delete_all_sessions(self):
        self.sessionsColl.delete_many({})

    def find_sessions(self):
        sessionsArray = []
        for sessions in self.sessionsColl.find():
            sessionsArray.append(sessions)
        return sessionsArray
    
    def update_session(self, session_id, new_title):
        self.sessionsColl.update_one(
            {"session_id": session_id, "title": "New chat"},
            {"$set": {"title": new_title}}
        )








