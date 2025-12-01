from . import db
from datetime import datetime
import uuid

class SessionDatabase: 
    def __init__(self):
        self.sessionsColl = db["sessions"]
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








