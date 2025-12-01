from datetime import datetime
from flask import current_app

from app import messageDB, sessionDB, client


def message_memory_list(sess_id: str):
    docs_array: list[dict] = []

    cursor = messageDB.messagesColl.find(
        {"sessionId": sess_id},
        {"_id": 0, "sessionId": 0, "created_at": 0}
    ).sort("_id", -1)

    for i, doc in enumerate(cursor):
        if i >= 10:
            break

        for key, value in doc.items():
            if isinstance(value, datetime):
                doc[key] = value.isoformat()

        docs_array.append(doc)

    print("messageMemory:", docs_array)
    return docs_array


def chat_title(user_message: str) -> str:
    resp = client.chat.completions.create(
        model="gpt-5-nano",
        messages=[
            {
                "role": "system",
                "content": "Summarize this into a concise title in no more than 5 words.",
            },
            {
                "role": "user",
                "content": user_message,
            },
        ],
    )

    title = str(resp.choices[0].message.content)
    print("\n\n", title, "\n")
    return title
