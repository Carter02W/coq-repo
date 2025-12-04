# create app, wiring, OpenAI, DBs, CORS

from flask import Flask
from flask_cors import CORS
from dotenv import load_dotenv 
from pathlib import Path
from openai import OpenAI
import os

from .db.messageDatabase import MessageDatabase
from .db.chatDatabase import ChatDatabase
from .db.userDatabase import UserDatabase

messageDB = MessageDatabase()
chatDB = ChatDatabase()
userDB = UserDatabase()
client: OpenAI | None = None

def _load_env():
    env_path = Path(__file__).resolve()
    for parent in env_path.parents:
        candidate = parent / ".env.local"
        if candidate.exists():
            load_dotenv(dotenv_path=candidate)
            print("loaded", candidate)
            break

def create_app() -> Flask:
    global client

    _load_env()

    # api connection
    api_key = os.getenv("OPENAI_API_KEY")
    print("api key found?", bool(api_key))
    client = OpenAI(api_key=api_key)

    app = Flask(__name__)
    CORS(app)

    #register blueprints 
    from .chat.routes import bp as chat_bp
    app.register_blueprint(chat_bp)

    from .auth.routes import bp as auth_bp
    app.register_blueprint(auth_bp)
    
    return app