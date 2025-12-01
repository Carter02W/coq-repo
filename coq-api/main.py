from app import create_app, messageDB, sessionDB

app = create_app()

if __name__ == "__main__":
    try:
        app.run(host="127.0.0.1", port=8080, debug=True, use_reloader=False)
    finally:
        messageDB.client.close()
        sessionDB.client.close()