"use client";

import { Roboto } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roboto = Roboto({
  subsets: ["latin"],
});

type LoginWindowProps = {
  onGoToSignUp: () => void;
};

type FieldType = 
"password" 
| "email" 
| "name"
| "phone"
| "confirm_pass";

function LogInWindow({ onGoToSignUp }: LoginWindowProps) {
  const router =useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);
  const [emailErrorString, setEmailErrorString] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);
  const [passwordErrorString, setPasswordErrorString] = useState("");

  
  function fail(type: FieldType, msg: string): boolean {
    if (type === "password") {
      setPasswordError(true);
      setPasswordErrorString(msg);
    }
    if (type === "email") {
      setEmailError(true);
      setEmailErrorString(msg);
    }
    return false;
  }

  // check email input isnt empty
  function emailNotEmpty(): boolean {

    if (email.length <= 0) {
      fail("email", "please enter an email");
      return false;
    }

    if (emailError) setEmailError(false);
    return true;
  }

  // check password input isnt empty
  function passwordNotEmpty(): boolean {

     if (password.length <= 0) {
      fail("password", "please enter a password");
      return false;
    }

    if (passwordError) setPasswordError(false);
    return true;
  }
  


  const handleSubmit = async ()  => {

    console.log("email: ", email);
    console.log("password: ", password);

    const emailSuccess = emailNotEmpty();
    const passSuccess = passwordNotEmpty();

    if (!emailSuccess || !passSuccess) return;

    const res = await fetch("http://127.0.0.1:8080/login", {
      method: "POST",
      headers: { "content-type": "application/json" },
        body: JSON.stringify({
          email: email.toLowerCase().trim(),
          password: password.trim(),
        }),
    });

    const data = await res.json();
    console.log("user found:", data);
    

    if (!data.ok) {
      if (data.type === "email") {
        setEmailError(true);
        setEmailErrorString(data.error_msg);
      }
      else {
        setPasswordError(true);
        setPasswordErrorString(data.error_msg);
      }
      return;
    }

    const user_id = data.user._id

    console.log("passing user_id:", user_id);

    router.push(`/chat?user_id=${user_id}`);
  };

  function clickShowPass() {
    if (!showPassword) {
      setShowPassword(true);
    } 
    else {
      setShowPassword(false);
    }
  }
  
  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {/* main content window */}
      {/* login content window*/}
      <div className="flex flex-col items-center min-h-100 min-w-100 justify-between px-10 py-10 gap-7 border-1 border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg shadow-blue-300 dark:shadow-gray-800">
        
        {/* text field */}
        <div className="flex flex-col items-center w-[40vh]">
          <label className="text-5xl font-bold">Welcome Back</label>
          <label className="text-sm text-gray-500">Sign in to continue</label>
        </div>
        
        {/* input field */}
        <div className="flex flex-col w-[40vh] gap-7">

          <div className="flex flex-col">
            {/* password error label */}
            <label htmlFor="email" className={` ${emailError ? "flex" : "hidden"} text-sm text-red-500`}>{emailErrorString}</label>
            {/* email */}
            <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={emailError ? "invalid Email" : "Email"}
              className={[
                "outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm",
                emailError ? "border-red-500" : "border-gray-300"
              ].join(" ")}
              />
          </div>

          <div className="flex flex-col">
          {/* password error label */}
            <label htmlFor="password" className={` ${passwordError ? "flex" : "hidden"} text-sm text-red-500`}>{passwordErrorString} </label>
            {/* holds password and show password button */}
            <div className={`flex px-1 border-1 rounded-sm ${passwordError ? "border-red-500" : "border-gray-300"}`}>
              <input id="password" type={showPassword ? "text": "password"} placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} 
                className="flex-1 h-[4vh] outline-none" />
              <button
                type="button"
                onClick={clickShowPass}
                className="text-xs text-blue-400"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          </div>

          {/* forgot password */}
          <button 
            className="text-xs text-blue-400">forgot password?
          </button>
  
        </div>

        {/* button field */}
        <div className="flex flex-col justify-center w-[40vh] h-[4vh] gap-2 shadow-sm shadow-gray-500 rounded bg-gradient-to-br from-indigo-500 to-violet-500">
          <button onClick={handleSubmit} >Sign in</button>
        </div>
      </div>

      {/* sign up link */}
      <div className="flex gap-3">
        <label htmlFor="signUp" className="text-sm text-gray-500">
          New to COQ app?
        </label>
        <button 
          id="signUp" 
          className="text-sm text-blue-400 underline"
          onClick={onGoToSignUp}>
            Sign up
        </button>
      </div>
    </div>
  );
};

type FieldState = {
  value: string;
  error: boolean;
  msg: string;
}

type Fields = Record<FieldType, FieldState>;

type SignUpProps = {
  onGoToLogin: () => void;
};


function SignUpWindow({ onGoToLogin }: SignUpProps) {
  const router =useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [fields, setFields] = useState<Fields>({

    name:         { value: "", error: false, msg: ""},
    email:        { value: "", error: false, msg: ""},
    phone:        { value: "", error: false, msg: ""},
    password:     { value: "", error: false, msg: ""},
    confirm_pass: { value: "", error: false, msg: ""},

  });

  function setFieldValue(type: FieldType, value: string) {
    setFields(prev => ({
      ...prev,
      [type]: { ...prev[type], value },
    }));
  }

  function setFieldError(type: FieldType, error: boolean, msg: string) {
    setFields(prev => ({
      ...prev,
      [type]: { ...prev[type], error, msg},
    }));
  }

  function clearFieldError(type: FieldType) {
    setFieldError(type, false, "");
  }

  function fail(type: FieldType, msg: string): boolean {
    setFieldError(type, true, msg)
    return false;
  }

  // name validation
  function validName(): boolean {
    const name = fields.name.value;

    if (name.length <= 0) {
      return fail("name", "must enter name")
    }

    clearFieldError("name");
    return true;
  }

  // email validation
  function validEmail(): boolean {
    const email = fields.email.value

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return fail("email", "invalid email format");
    }
    
    clearFieldError("email");
    return true;
  }

  // password validation
  function validPassword(): boolean {
    const password = fields.password.value

    if (password.length < 8) return fail("password", "invalid password: must be longer than 8 characters");
    if (!/[A-Z]/.test(password)) return fail("password", "invalid password: must have at least one upper case character");
    if (!/[a-z]/.test(password)) return fail("password", "invalid password: must have at least one lower case character");
    if (!/[0-9]/.test(password)) return fail("password","invalid password: must have at least one number")
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return fail("password", "invalid password: must have at least one special character");

    clearFieldError("password");
    return true;
  }

  // phone validation
  function validPhone(): boolean {
    const phone = fields.phone.value
    const cleaned = phone.replace(/\D/g, ""); // remove all non-digets

    if (cleaned.length != 11) {
      return fail("phone", "enter a 11 diget phone number");
    }

    clearFieldError("phone");
    return true;
  }

  // confirm pass validation
  function validConfPass(): boolean {
    const password = fields.password.value
    const conf_pass = fields.confirm_pass.value

    if (conf_pass != password) {
      return fail("confirm_pass", "password does not match");
    }

    return true;
  }

  // hides and shows password
  function clickShowPass() {
    if (!showPassword) {
      setShowPassword(true);
    } 
    else {
      setShowPassword(false);
    }
  }

  const handleSubmit = async ()  => {

    const isValidName = validName();
    const isValidEmail = validEmail();
    const isValidPhone = validPhone();
    const isValidPassword = validPassword();
    const isValidConfPass = validConfPass();

    if (!isValidName || !isValidEmail || !isValidPhone || !isValidPassword || !isValidConfPass) return;


    const res = await fetch("http://127.0.0.1:8080/signup", {
      method: "POST",
      headers: {"content-type": "application/json" },
      body: JSON.stringify({
        name: fields.name.value,
        email: fields.email.value,
        phone: fields.phone.value,
        password: fields.password.value,
        confirm_pass: fields.confirm_pass.value,

      })
    });

    const data = await res.json()
    console.log("signup data:", data)

    if (!data) {
      console.log("insert failed:", data)
      return;
    }

    const findNewUser = await fetch("http://127.0.0.1:8080/findNewUser", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({
        email: fields.email.value,
      })
    });

    const findNewUserData = await findNewUser.json()

    const user_id = findNewUserData._id
    console.log("findNewUser user_id:", user_id)

    router.push(`/chat?user_id=${user_id}`);
  };

  return (
    <div className="flex flex-col justify-center items-center gap-5">
      {/* main content window */}
      {/* sign up content window*/}
      <div className="flex flex-col items-center min-h-100 min-w-100 justify-between px-10 py-10 gap-7 border-1 border-gray-100 dark:border-gray-800 rounded-2xl shadow-lg shadow-blue-300 dark:shadow-gray-800">
        
        {/* text field */}
        <div className="flex flex-col items-center w-[40vh]">
          <label className="text-5xl font-bold">Welcome</label>
          <label className="text-sm text-gray-500">Sign up to continue</label>
        </div>
        
        {/* input field */}
        <div className="flex flex-col w-[40vh] gap-5">

          <div className="flex flex-col">
            {/* name error label */}
            <label htmlFor="name" className={` ${fields.name.error ? "flex" : "hidden"} text-sm text-red-500`}>{fields.name.msg}</label>
            {/* name */}
            <input type="text" name="name" value={fields.name.value} onChange={(e) => setFieldValue("name", e.target.value)} autoComplete="name" placeholder="Name" 
              className={`${fields.name.error ? "border-red-500" : "border-gray-300"} outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm `} 
            />
          </div>
          
          <div className="flex flex-col">
            {/* email error label */}
            <label htmlFor="email" className={` ${fields.email.error ? "flex" : "hidden"} text-sm text-red-500`}>{fields.email.msg}</label>
            {/* email */}
            <input type="email" value={fields.email.value} onChange={(e) => setFieldValue("email", e.target.value)} placeholder="Email" autoComplete="email" 
              className={`${fields.email.error ? "border-red-500" : "border-gray-300"} outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm `}
            />
          </div>
          
          <div className="flex flex-col">
            {/* phone error label */}
            <label htmlFor="phone" className={` ${fields.phone.error ? "flex" : "hidden"} text-sm text-red-500`}>{fields.phone.msg}</label>
            {/* phone */}
            <input type="tel" name="phone" value={fields.phone.value} onChange={(e) => setFieldValue("phone", e.target.value)} autoComplete="tel" placeholder="Phone number" 
              className={`${fields.phone.error ? "border-red-500" : "border-gray-300"} outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm `} 
            />
          </div>

          <div className="flex flex-col">
            {/* create pass error label */}
            <label htmlFor="createPassword" className={` ${fields.password.error ? "flex" : "hidden"} text-sm text-red-500`}>{fields.password.msg}</label>
            {/* create password */}
            <input id="createPassword" value={fields.password.value} onChange={(e) => setFieldValue("password", e.target.value)} type={showPassword ? "text": "password"} placeholder="Create password" 
              className={`${fields.password.error ? "border-red-500" : "border-gray-300"} outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm `}
            />
          </div>
         
          <div className="flex flex-col">
            {/* confirm pass error label */}
            <label htmlFor="confirmPassword" className={` ${fields.confirm_pass.error ? "flex" : "hidden"} text-sm text-red-500`}>{fields.confirm_pass.msg}</label>
            {/* holds confirm password and show password button */}
            <div className={`flex px-1 border-1 ${fields.confirm_pass.error ? "border-red-500" : "border-gray-300"} rounded-sm`}>
              <input id="confirmPassword" value={fields.confirm_pass.value} onChange={(e) => setFieldValue("confirm_pass", e.target.value)} type={showPassword ? "text": "password"} placeholder="Confirm password" 
                className="flex-1 h-[4vh] outline-none"
              />
              <button
                type="button"
                onClick={clickShowPass}
                className="text-xs text-blue-400"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div> 
          </div>

        </div>

        {/* button field */}
        <div className="flex flex-col justify-center w-[40vh] h-[4vh] gap-2 shadow-sm shadow-gray-500 rounded bg-gradient-to-br from-indigo-500 to-violet-500">
          <button onClick={handleSubmit}>Sign up</button>
        </div>
      </div>

      {/* sign up link */}
      <div className="flex gap-3">
        <label htmlFor="login" className="text-sm text-gray-500">
          Already have an account?
        </label>
        <button 
          id="login" 
          className="text-sm text-blue-400 underline"
          onClick={onGoToLogin}>
            Login
        </button>
      </div>
    </div>
  );
};



export default function Home() {
  const [isSignUp, setIsSignUp] = useState(false);

  return (
    // main window
    <div className={roboto.className + " h-screen flex flex-col justify-center items-center"}>

      {/* logo and website title */}
      <div className="absolute top-4 left-4 flex items-center gap-2 ">
        <span className="rounded-lg bg-gradient-to-br from-indigo-500 to-violet-500 px-3 py-2 text-white text-lg font-semibold tracking-wide">
          Logo
        </span>
        <div className="text-2xl">coq app</div>
      </div>

      {isSignUp ? ( 
        <SignUpWindow
          onGoToLogin={() => setIsSignUp(false)}
        />
      ) : (
        <LogInWindow
          onGoToSignUp={() => setIsSignUp(true)}
          />
      )}
    </div>
  );
};