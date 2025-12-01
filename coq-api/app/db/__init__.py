from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
from dotenv import load_dotenv
from pathlib import Path
import os

env_path = Path(__file__).resolve()

for parent in env_path.parents:
    candidate = parent / ".env.local"
    if candidate.exists():
        load_dotenv(dotenv_path=candidate)
        break

dbURI = os.getenv("MONGODB_ATLAS_CONNECTION")
if dbURI:
    print("MongoDB Atlas connection uri found")
else:
    raise RuntimeError("Missing MONGODB_ATLAS_CONNECTION in env")

mongoClient = MongoClient(dbURI, server_api=ServerApi('1'))
db = mongoClient["coqDB"]
