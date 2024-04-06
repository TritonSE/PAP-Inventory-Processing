// Login.tsx
"use client";

import React, { useState } from "react";
import InputField from "@/components/shared/input/InputField";
import Image from "next/image";
import styles from "@/app/login/page.module.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { useRedirectToHomeIfSignedIn } from "@/hooks/useRedirection";
import { getWhoAmI } from "@/api/Users";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/shared/Button";

enum LoginPageError {
  NO_INTERNET,
  INVALID_CREDENTIALS,
  INTERNAL,
  TOO_MANY_REQUESTS,
  NONE,
}

/**
 * The root Login page component.
 */
const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(LoginPageError.NONE);

  useRedirectToHomeIfSignedIn();

  const { auth } = initFirebase();

  const { isMobile } = useScreenSizes();

  /**
   * Sends the user's Firebase token to the /api/user/whoami backend route,
   * to ensure they are a valid user and we can retrieve their identity.
   */
  const sendTokenToBackend = async (token: string) => {
    const res = await getWhoAmI(token);
    if (!res.success) {
      if (res.error === "Failed to fetch") {
        setPageError(LoginPageError.NO_INTERNET);
      } else {
        console.error(`Cannot retrieve whoami: error ${res.error}`);
        setPageError(LoginPageError.INTERNAL);
      }
    }
  };

  /**
   * Logs the user in using their entered email and password.
   */
  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Sign in to Firebase
      const userCredential = await signInWithEmailAndPassword(auth, email, password);

      // Get token for user
      const token = await userCredential.user?.getIdToken();
      if (!token) {
        console.error("JWT token not retrieved.");
        setPageError(LoginPageError.INTERNAL);
      } else {
        // Once we have the token, send it to the /api/user/whoami backend route
        await sendTokenToBackend(token);
      }
    } catch (error) {
      console.error("Firebase login failed with error: ", error);

      // See https://firebase.google.com/docs/auth/admin/errors for Firebase error codes
      switch ((error as FirebaseError)?.code) {
        case "auth/invalid-email":
        case "auth/invalid-credentials":
        case "auth/invalid-login-credentials":
          setPageError(LoginPageError.INVALID_CREDENTIALS);
          break;
        case "auth/network-request-failed":
          setPageError(LoginPageError.NO_INTERNET);
          break;
        case "auth/too-many-requests":
          setPageError(LoginPageError.TOO_MANY_REQUESTS);
          break;
        default:
          setPageError(LoginPageError.INTERNAL);
          break;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, password);
  };

  // Move error notification higher up than usual
  const errorNotificationStyles = {
    top: 18,
  };

  /**
   * Renders an error notification based on the current error, or renders nothing
   * if there is no error.
   */
  const renderErrorNotification = () => {
    switch (pageError) {
      case LoginPageError.NO_INTERNET:
        return (
          <ErrorNotification
            isOpen
            mainText="No Internet Connection"
            subText="Unable to login due to no internet connection. Please check your connection and try again."
            actionText="Dismiss"
            onActionClicked={() => setPageError(LoginPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case LoginPageError.INVALID_CREDENTIALS:
        return (
          <ErrorNotification
            isOpen
            mainText="Invalid Credentials"
            subText="Invalid email and/or password, please try again."
            actionText="Dismiss"
            onActionClicked={() => setPageError(LoginPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case LoginPageError.TOO_MANY_REQUESTS:
        return (
          <ErrorNotification
            isOpen
            mainText="Too Many Requests"
            subText="You have made too many login attempts. Please try again later."
            actionText="Dismiss"
            onActionClicked={() => setPageError(LoginPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case LoginPageError.INTERNAL:
        return (
          <ErrorNotification
            isOpen
            mainText="Internal Error"
            subText="Something went wrong with logging in. Our team is working to fix it. Please try again later."
            actionText="Dismiss"
            onActionClicked={() => setPageError(LoginPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      default:
        return null;
    }
  };

  // Whether at least one of the credential fields is missing, in which case we
  // disable the submit button.
  const missingCredentials = email === "" || password === "";

  return (
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
          <Button
            variant="primary"
            outlined={false}
            text="Log In"
            loading={loading}
            type="submit"
            className={`${styles.loginButton} ${missingCredentials ? styles.disabledButton : ""}`}
          />
        </form>
      </div>
      {renderErrorNotification()}
    </div>
  );
};

export default Login;
