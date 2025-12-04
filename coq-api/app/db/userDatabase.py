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

        self.usersColl.insert_one(doc)




    def find_user(self, email: str):

        user = self.usersColl.find_one({"email": email})

        print("userDatabase find_user returns: ", user)

        return user

    