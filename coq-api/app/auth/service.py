from app import userDB
import bcrypt

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())

def match_passwords(password:str, hash_pass:bytes):
    return bcrypt.checkpw(password.encode("utf-8"), hash_pass)



def verify_signup( name:str, email:str, phone:str, password:str): 
    hash_pass = hash_password(password)

    userRes = userDB.create_user(name, email, phone, hash_pass)
    print("verify_signup:", userRes)

    return userRes



def verify_login(email: str, input_password: str):

    user = userDB.find_user(email)
    stored_hash_pass = user["password_hash"]

    print("verify_login user:", user)
     
    if not user:
        return {"ok": False, "type": "email", "error_msg": f"no account with email: {email}"}
    
    print("passwords match:", match_passwords(input_password, stored_hash_pass))
    
    if not match_passwords(input_password, stored_hash_pass):
        return {"ok": False, "type": "password", "error_msg": "incorect password"}

    user.pop("password_hash", None)
    print("validateUser returns:", {"ok": True, "user": user})
    

    return {"ok": True, "user": user}
        

# verify password