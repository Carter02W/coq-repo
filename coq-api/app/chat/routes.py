from flask import Blueprint, request, jsonify
from app import messageDB, sessionDB, client
from .service import message_memory_list, chat_title

bp = Blueprint("chat", __name__)



@bp.route("/listMessages", methods=["POST"])
def list_messages():
    data = request.get_json(force=True)
    print("\nlistMessage data:", data)

    curr_session_id = data.get("sessionId", "").strip()
    print("listMessages currSessionId:", curr_session_id)

    messages_array = []
    cursor = messageDB.messagesColl.find(
        {"sessionId": curr_session_id},
        {"_id": 0, "created_at": 0},
    )
    for i, message in enumerate(cursor):
        if i < 10:
            messages_array.append(message)

    print("listMessages messagesArray:", messages_array, "\n")
    return jsonify(messages_array)



@bp.route("/chat", methods=["POST"])
def chat():
    data = request.get_json(force=True)
    user_input = data.get("message", "").strip()
    curr_session = data.get("sessionId", "").strip()

    print("chat received current session:", curr_session, "\n")

    if not user_input:
        return jsonify({"reply": "I didn't receive any text."}), 400

    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages=(
            [{"role": "system", "content": "You are concise and to the point."}]
            + message_memory_list(curr_session)
            + [{"role": "user", "content": user_input}]
        ),
    )

    reply = resp.choices[0].message.content

    messageDB.add_message("user", user_input, curr_session)
    messageDB.add_message("assistant", reply, curr_session)

    print(
        "\n\n",
        list(sessionDB.find_sessions()),
        "\nCurrent Session =",
        curr_session,
        "\nUser Input =",
        user_input,
        "\n",
    )

    # rename "New chat" sessions
    session_doc = sessionDB.sessionsColl.find_one(
        {"session_id": curr_session},
        {"title": 1},
    )

    if session_doc and session_doc.get("title") == "New chat":
        new_title = chat_title(user_input)
        sessionDB.update_session(curr_session, new_title)
        print("\nupdate triggered")

    return jsonify({"reply": reply})




@bp.route("/listChats", methods=["GET"])
def list_chats():
    sessions_array = []
    for sess in sessionDB.find_sessions():
        sess["_id"] = str(sess["_id"])
        sessions_array.insert(0, sess)
    return jsonify(sessions_array)




@bp.route("/createChat", methods=["GET"])
def create_chat():
    sessionDB.create_session()
    # reuse list_chats logic
    res = list_chats().json  # Flask Response -> dict via .json on response
    print(res)
    return jsonify(res)
