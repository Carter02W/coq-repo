from . import db
from datetime import datetime

class UserDatabase:
    def __init__(self):
        self.usersColl = db["user"]
        
        

    def create_user(self, email: str, password_hash: str, role: str = "user"):
        doc = {
            "email": email,
            "password_hash": password_hash, 
            "role": role,
            "created_at": datetime.now()
        }

        self.usersColl.insert_one(doc)

    def find_user(self, email: str):
        doc = {
            "email": email
        }
        
        user = self.usersColl.find_one(doc)

        return user

    