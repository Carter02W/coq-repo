from flask import Blueprint, request, jsonify
from .service import verify_login, verify_signup, find_user_id

bp = Blueprint("auth", __name__)

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email = data.get("email", " ")
    password = data.get("password", " ")

    res = verify_login(email, password)
    print(res)

    return jsonify(res)



@bp.route("/signup", methods=["POST"])
def signup():
    data = request.get_json(force=True)
    name = data.get("name", "")
    email = data.get("email", "")
    phone = data.get("phone", "")
    password = data.get("password", "")
    conf_pass = data.get("confirm_pass", "")

    print("password:", password, "conf_pass:", conf_pass)

    if password != conf_pass:
        return jsonify({
            "ok": False,
            "error": "passwords dont match"
        })

    insertRes = verify_signup(name, email, phone, password)
    
    if not insertRes:
        return jsonify({
            "ok": False,
            "message": "insert failed"
        })
    
    return jsonify ({
        "ok": True,
        "message": "user created"
    })


@bp.route("/findNewUser", methods=["POST"])
def findNewUser():
    data = request.get_json(force=True)
    email = data.get("email", " ")

    user = find_user_id(email)

    print("findNewUser returns:", user)

    return jsonify(user)
