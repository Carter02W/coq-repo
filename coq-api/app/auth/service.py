from app import userDB
import bcrypt

def hash_password(password: str) -> bytes:
    return bcrypt.hashpw(password.encode("utf-8"), bcrypt.gensalt())



def verify_signup( name:str, email:str, phone:str, password:str):
    hash_pass = hash_password(password)
    userDB.create_user(name, email, phone, hash_pass)




def verify_login(email: str, input_password: str):

    user = userDB.find_user(email)

    print("verify_login user:", user)
     
    if not user:
        return {"ok": False, "type": "email", "error_msg": f"no account with email: {email}"}
    
    if user["password"] != input_password:
        print("passord:", input_password, "doesnt match user.password:", user["password"])
        return {"ok": False, "type": "password", "error_msg": "incorect password"}

   
    user["_id"] = str(user["_id"])

    print("validateUser returns:", {"ok": True, "user": user})
    
    return {"ok": True, "user": user}
        

# verify password