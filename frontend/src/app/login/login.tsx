// Login.tsx
"use client";

import React, { useState } from "react";
import InputField from "@/components/InputField";
import Image from "next/image";
import "src/app/login/Login.css";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { app, auth } = initFirebase();

  const login = (email: string, password: string) => {
    console.log("inside login function");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log("signed in successfully!");
        console.log(userCredential);
      })
      .catch((error) => {
        console.log("did not sign in :(");
        console.log(error);
      });
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("inside handleLogin function");
    login(email, password);
  };

  return (
    <body>
      <div className="login-container">
        <Image
          src="/Images/login_bg.png"
          alt=""
          layout="fill"
          priority
          /* Inline styling due to using Image Component*/
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            filter: "brightness(10%)",
            opacity: "0.5",
          }}
        />
        <div className="login-box">
          <div className="logo-container">
            <div className="logo-image">
              <Image src="/Images/LoginImage.png" alt="Logo" width={190} height={90} />
            </div>
          </div>
          <div className="welcome-text">Welcome!</div>
          <form onSubmit={handleLogin} className="login-form">
            <div className="input-group">
              <InputField
                label="Email"
                id="email"
                placeholder="e.g. johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="input-group">
              <InputField
                label="Password"
                id="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
            <div className="forgot-password">Forgot Password?</div>
            <button type="submit" className="login-button">
              Log In
            </button>
          </form>
        </div>
      </div>
    </body>
  );
};

export default Login;
