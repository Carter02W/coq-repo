from flask import Blueprint, request, jsonify
from app import messageDB, chatDB, client
from .service import message_memory_list, chat_title

bp = Blueprint("chat", __name__)



@bp.route("/listMessages", methods=["POST"])
def list_messages():
    data = request.get_json(force=True)
    print("\nlistMessage data:", data)

    curr_chat_id = data.get("chat_id", "").strip()
    print("listMessages currchat_id:", curr_chat_id)

    messages_array = []
    cursor = messageDB.messagesColl.find(
        {"chat_id": curr_chat_id},
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
    curr_chat = data.get("chat_id", "").strip()

    print("chat received current chat:", curr_chat, "\n")

    if not user_input:
        return jsonify({"reply": "I didn't receive any text."}), 400

    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages=(
            [{"role": "system", "content": "You are concise and to the point."}]
            + message_memory_list(curr_chat)
            + [{"role": "user", "content": user_input}]
        ),
    )

    reply = resp.choices[0].message.content

    messageDB.add_message("user", user_input, curr_chat)
    messageDB.add_message("assistant", reply, curr_chat)

    print(
        "\n\n",
        list(chatDB.find_chats()),
        "\nCurrent Chat =",
        curr_chat,
        "\nUser Input =",
        user_input,
        "\n",
    )

    # rename "New chat" chatss
    chat_doc = chatDB.chatsColl.find_one(
        {"chat_id": curr_chat},
        {"title": 1},
    )

    if chat_doc and chat_doc.get("title") == "New chat":
        new_title = chat_title(user_input)
        chatDB.update_chat(curr_chat, new_title)
        print("\nupdate triggered")

    return jsonify({"reply": reply})




@bp.route("/listChats", methods=["GET"])
def list_chats():
    chats_array = []
    for sess in chatDB.find_chats():
        sess["_id"] = str(sess["_id"])
        chats_array.insert(0, sess)
    return jsonify(chats_array)




@bp.route("/createChat", methods=["GET"])
def create_chat():
    chatDB.create_chat()
    # reuse list_chats logic
    res = list_chats().json  # Flask Response -> dict via .json on response
    print(res)
    return jsonify(res)
