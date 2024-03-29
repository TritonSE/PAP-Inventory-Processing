// Login.tsx
"use client";

import React, { useState } from "react";
import InputField from "@/components/shared/input/InputField";
import Image from "next/image";
import styles from "@/app/login/page.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { useRouter } from "next/navigation";
import { useScreenSizes } from "@/util/useScreenSizes";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { auth } = initFirebase();

  const router = useRouter();

  const { isMobile } = useScreenSizes();

  const sendTokenToBackend = async (token: string) => {
    try {
      const response = await fetch(`http://localhost:3001/api/whoami`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const userInfo = await response.json();
        console.log(userInfo);
        router.push("/dummyPage");
      } else {
        console.error("Failed to get user info from JWT Token");
      }
    } catch (error) {
      console.error("error sending JWT token to backend", error);
    }
  };

  const login = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user?.getIdToken();
      if (!token) {
        console.error("JWT token not retrieved.");
      } else {
        await sendTokenToBackend(token);
      }
    } catch (error) {
      console.error("login failed: ", error);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  return (
    <body>
      <div className={styles.loginContainer}>
        <Image
          src="/Images/login_bg.png"
          alt=""
          layout="fill"
          objectFit="cover"
          priority
          /* Inline styling due to using Image Component*/
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "30",
            bottom: "0",
          }}
          className={styles.backgroundImage}
        />
        <div
          style={{
            position: "absolute",
            top: "0",
            left: "0",
            right: "0",
            bottom: "0",
            background: "#232220D9",
          }}
        />
        <div className={styles.loginBox}>
          <div className={styles.logoContainer}>
            <div className={styles.logoImage}>
              <Image
                src="/Images/LoginImage.png"
                alt="Logo"
                className={styles.image}
                width={isMobile ? 130 : 190}
                height={isMobile ? 60 : 90}
              />
            </div>
          </div>
          <div className={styles.welcomeText}>Welcome!</div>
          <form onSubmit={handleLogin} className={styles.loginForm}>
            <div className={styles.inputGroup}>
              <InputField
                label="Email"
                id="email"
                placeholder="e.g. johndoe@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles.inputGroup}>
              <InputField
                label="Password"
                id="password"
                placeholder=""
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                type="password"
              />
            </div>
            <div className={styles.forgotPassword}>Forgot Password?</div>
            <button type="submit" className={styles.loginButton}>
              Log In
            </button>
          </form>
        </div>
      </div>
    </body>
  );
};

export default Login;
