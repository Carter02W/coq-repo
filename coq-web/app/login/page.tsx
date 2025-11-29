"use client";

import { Roboto } from "next/font/google";
import { useState } from "react";

const roboto = Roboto({
  subsets: ["latin"],
});

type LoginWindowProps = {
  password: string;
  showPassword: boolean;
  onPasswordChange: (value: string) => void;
  onForgotPassword: () => void;
  onToggleShowPassword: () => void;
  onGoToSignUp: () => void;
};

function LogInWindow({ password, showPassword, onPasswordChange, onForgotPassword, onToggleShowPassword, onGoToSignUp,}: LoginWindowProps) {
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

          {/* email | username */}
          <input id="email" type="email" placeholder="Email or Username" 
            className="outline-none  h-[4vh] px-1 border-1 border-gray-300 rounded-sm " 
            />

          {/* holds password and show password button */}
          <div className="flex px-1 border-1 border-gray-300 rounded-sm">
            <input id="password" type={showPassword ? "text": "password"} placeholder="Password" value={password} onChange={(e) => onPasswordChange(e.target.value)} className="flex-1 h-[4vh] outline-none" />
            <button
              type="button"
              onClick={onToggleShowPassword}
              className="text-xs text-blue-400"
            >
              {showPassword ? "hide" : "show"}
            </button>
          </div>

          {/* forgot password */}
          <button 
            onClick={onForgotPassword} 
            className="text-xs text-blue-400">forgot password?
          </button>
  
        </div>

        {/* button field */}
        <div className="flex flex-col justify-center w-[40vh] h-[4vh] gap-2 shadow-sm shadow-gray-500 rounded bg-gradient-to-br from-indigo-500 to-violet-500">
          <button>Sign in</button>
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
          password={password}
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