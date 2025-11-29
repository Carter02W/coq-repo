from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from pathlib import Path
from dotenv import load_dotenv
from datetime import datetime
import uuid
import os

env_path = Path(__file__).resolve()
for parent in env_path.parents:
    candidate = parent/".env.local"

    if candidate.exists():
        load_dotenv(dotenv_path=candidate)
        print("userDatabase loaded env path", candidate)
        break

dbUri = os.getenv("MONGODB_ATLAS_CONNECTION")
print("userDatabase connection found?", bool(dbUri))

class UserDatabase:
    def __init__(self):
        self.client = MongoClient(dbUri, server_api=ServerApi('1'))
        self.db = self.client["coqDB"]
        self.usersColl = self.db["users"]
        