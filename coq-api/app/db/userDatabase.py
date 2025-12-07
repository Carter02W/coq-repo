from . import db
from datetime import datetime

class UserDatabase:
    def __init__(self):
        self.usersColl = db["users"]
        
        

    def create_user(self, name: str, email: str, phone: str, password_hash: str, role: str = "user"):
        doc = {
            "name": name,
            "email": email,
            "phone": phone,
            "password_hash": password_hash, 
            "role": role,
            "created_at": datetime.now()
        }

        user = self.usersColl.insert_one(doc)
        print("insert_user_result:", user)
    
        return user


    def find_user_id(self, email:str):
        
        user = self.usersColl.find_one(
            {"email": email},
            {"_id": 1}
        )
        
        user["_id"] = str(user["_id"])

        return user


    def find_user(self, email: str):

        user = self.usersColl.find_one(
            {"email": email},
            {"created_at": 0}
        )

        print("userDatabase find_user returns: ", user)

        return user

    