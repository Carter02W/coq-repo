from flask import Blueprint, request, jsonify
from .service import verify_login, verify_signup

bp = Blueprint("auth", __name__)

@bp.route("/login", methods=["POST"])
def login():
    data = request.get_json(force=True)
    email = data.get("email", " ")
    password = data.get("password", " ")

    res, status = verify_login(email, password)
    print(status, res)

    return jsonify(res), status

@bp.route("/signup", methods=["GET"])
def signup():
    data = request.get_json(force=True)
    name = data.get("name", "")
    email = data.get("email", "")
    phone = data.get("phone", "")
    password = data.get("password", "")
    conf_pass = data.get("confirm_pass", "")

    if password == conf_pass:
        res = verify_signup(name, email, phone, password)
    else:
        print("there should be an error handle here maybe") #####
