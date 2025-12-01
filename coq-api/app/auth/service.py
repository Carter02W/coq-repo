




# auth/service.py
# import bcrypt
# import jwt
# from datetime import datetime, timedelta
# import os

# SECRET = os.getenv("JWT_SECRET", "dev-secret-replace-me")

# def hash_password(password: str) -> str:
#     return bcrypt.hashpw(password.encode(), bcrypt.gensalt()).decode()

# def verify_password(password: str, hashed: str) -> bool:
#     return bcrypt.checkpw(password.encode(), hashed.encode())

# def create_jwt(user_id: str, role: str = "user") -> str:
#     payload = {
#         "sub": user_id,
#         "role": role,
#         "exp": datetime.utcnow() + timedelta(hours=1),
#     }
#     return jwt.encode(payload, SECRET, algorithm="HS256")

# def decode_jwt(token: str) -> dict:
#     return jwt.decode(token, SECRET, algorithms=["HS256"])
