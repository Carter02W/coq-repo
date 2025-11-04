from pymongo import MongoClient
from datetime import datetime, timezone
import uuid

class SessionDatabase: 
    def __init__(self):
        self.client = MongoClient("mongodb://localhost:27017/")
        self.db = self.client["coqDB"]
        self.sessionsColl = self.db["sessions"]
        self.session_id = None  # setup, no action yet

    def create_session(self, first_message="New chat"):
        self.session_id = str(uuid.uuid4())
        self.sessionsColl.insert_one({
            "session_id": self.session_id,
            "title": first_message[:40],
            "created_at": datetime.now(),
            "message_count": 0
        })

    def delete_all_sessions(self):
        self.sessionsColl.delete_many({})






