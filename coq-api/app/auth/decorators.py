

# # auth/decorators.py
# from functools import wraps
# from flask import request, jsonify
# from .service import decode_jwt

# def login_required(f):
#     @wraps(f)
#     def wrapper(*args, **kwargs):
#         auth_header = request.headers.get("Authorization", "")
#         if not auth_header.startswith("Bearer "):
#             return jsonify({"error": "Missing token"}), 401
        
#         token = auth_header.split(" ", 1)[1]

#         try:
#             payload = decode_jwt(token)
#         except Exception:
#             return jsonify({"error": "Invalid or expired token"}), 401

#         request.user = {
#             "id": payload["sub"],
#             "role": payload.get("role", "user"),
#         }

#         return f(*args, **kwargs)
#     return wrapper

# def require_role(role: str):
#     def decorator(f):
#         @wraps(f)
#         def wrapper(*args, **kwargs):
#             user = getattr(request, "user", None)
#             if not user or user.get("role") != role:
#                 return jsonify({"error": "Forbidden"}), 403
#             return f(*args, **kwargs)
#         return wrapper
#     return decorator
