"use client";

import { Roboto } from "next/font/google";
import { useState } from "react";
import { useRouter } from "next/navigation";

const roboto = Roboto({
  subsets: ["latin"],
});

type LoginWindowProps = {
  showPassword: boolean;
  onPasswordChange: (value: string) => void;
  onForgotPassword: () => void;
  onToggleShowPassword: () => void;
  onGoToSignUp: () => void;
};

type FieldType = "password" | "email";

function LogInWindow({ showPassword, onForgotPassword, onToggleShowPassword, onGoToSignUp,}: LoginWindowProps) {
  const router =useRouter();
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

  // email validation
  function validEmail(em: string): boolean {
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(em)) {
      setEmailErrorString("invalid email format");
      setEmailError(true);
      return false;
    }
    
    if (emailError) setEmailError(false);
    return true;
  }

  // password validation
  function validPassword(p: string): boolean {
    if (p.length < 8) return fail("password", "invalid password: must be longer than 8 characters");
    if (!/[A-Z]/.test(p)) return fail("password", "invalid password: must have at least one upper case character");
    if (!/[a-z]/.test(p)) return fail("password", "invalid password: must have at least one lower case character");
    if (!/[0-9]/.test(p)) return fail("password","invalid password: must have at least one number")
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(p)) return fail("password", "invalid password: must have at least one special character");

    if (passwordError) setPasswordError(false);
    return true;
  } 


  const handleSubmit = async ()  => {

    console.log("email: ", email);
    console.log("password: ", password);

    const emailSuccess = validEmail(email);
    const passSuccess = validPassword(password);

    if (!emailSuccess || !passSuccess) return;

    router.push("/chat");
  };
  
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
                onClick={onToggleShowPassword}
                className="text-xs text-blue-400"
              >
                {showPassword ? "hide" : "show"}
              </button>
            </div>
          </div>

          {/* forgot password */}
          <button 
            onClick={onForgotPassword} 
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


type SignUpProps = {
  password: string;
  showPassword: boolean;
  onToggleShowPassword: () => void;
  onGoToLogin: () => void;
};


function SignUpWindow({ password, showPassword, onToggleShowPassword, onGoToLogin, }: SignUpProps) {
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

          {/* name */}
          <input type="text" name="name" autoComplete="name" placeholder="Name" 
            className="outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm " 
          />
          
          {/* username */}
          <input type="text" name="username" placeholder="Username" 
            className="outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm " 
          />     
          
          {/* email */}
          <input type="email" placeholder="Email" autoComplete="email" 
            className="outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm "
          />
          
          {/* phone */}
          <input type="tel" name="phone" autoComplete="tel" placeholder="Phone number" 
            className="outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm " 
          />

          {/* create password */}
          <input id="password" type={showPassword ? "text": "password"} placeholder="Create password" 
            className="outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm " 
          />
         
            
          {/* holds confirm password and show password button */}
          <div className="flex px-1 border-1 border-gray-300 rounded-sm">
            <input id="password" type={showPassword ? "text": "password"} placeholder="Confirm password" 
              className="flex-1 h-[4vh] outline-none" 
            />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="text-xs text-blue-400"
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div> 

        </div>

        {/* button field */}
        <div className="flex flex-col justify-center w-[40vh] h-[4vh] gap-2 shadow-sm shadow-gray-500 rounded bg-gradient-to-br from-indigo-500 to-violet-500">
          <button>Sign up</button>
        </div>
      </div>

      {/* sign up link */}
      <div className="flex gap-3">
        <label htmlFor="signUp" className="text-sm text-gray-500">
          Already have an account?
        </label>
        <button 
          id="signUp" 
          className="text-sm text-blue-400 underline"
          onClick={onGoToLogin}>
            Login
        </button>
      </div>
    </div>
  );
};



export default function Home() {
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const test_button = () => {
    setPassword("forgot");
  };
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
          password={password}
          showPassword={showPassword}
          onToggleShowPassword={() => setShowPassword((prev) => !prev)}
          onGoToLogin={() => setIsSignUp(false)}
        />
      ) : (
        <LogInWindow
          showPassword={showPassword}
          onForgotPassword={test_button}
          onPasswordChange={setPassword}
          onToggleShowPassword={() => setShowPassword((prev) => !prev)}
          onGoToSignUp={() => setIsSignUp(true)}
          />
      )}
    </div>
  );
};