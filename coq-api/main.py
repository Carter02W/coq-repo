from app import create_app
from app.db import mongoClient

app = create_app()

if __name__ == "__main__":
    try:
        app.run(host="127.0.0.1", port=8080, debug=True, use_reloader=False)
    finally:
        mongoClient.close() 