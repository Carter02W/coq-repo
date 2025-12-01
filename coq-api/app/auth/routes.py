

# auth/routes.py
from flask import Blueprint, request, jsonify
from .service import hash_password, verify_password, create_jwt
# from yourdbmodule import UserDatabase  # your existing DB class

auth_bp = Blueprint("auth", __name__)

# userDB = UserDatabase()

# @auth_bp.route("/register", methods=["POST"])
# def register():
#     data = request.get_json(force=True)
#     email = data.get("email", "").strip()
#     password = data.get("password", "").strip()

#     if userDB.find_by_email(email):
#         return jsonify({"error": "Email already exists"}), 400

#     hashed = hash_password(password)
#     user_id = userDB.create_user(email, hashed)

#     return jsonify({"status": "registered", "userId": user_id})

# @auth_bp.route("/login", methods=["POST"])
# def login():
#     data = request.get_json(force=True)
#     email = data.get("email", "").strip()
#     password = data.get("password", "").strip()

#     user = userDB.find_by_email(email)
#     if not user:
#         return jsonify({"error": "Invalid credentials"}), 401

#     if not verify_password(password, user["password"]):
#         return jsonify({"error": "Invalid credentials"}), 401

#     token = create_jwt(str(user["_id"]), role=user.get("role", "user"))

#     return jsonify({"token": token})

# @auth_bp.route("/logout", methods=["POST"])
# def logout():
#     return jsonify({"status": "client must delete token"})
