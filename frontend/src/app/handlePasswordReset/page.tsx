// Login.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "@/app/handlePasswordReset/page.module.css";
import {
  signInWithEmailAndPassword,
  getAuth,
  sendPasswordResetEmail,
  verifyPasswordResetCode,
} from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { initializeApp } from "firebase/app";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { useRedirectToHomeIfSignedIn } from "@/hooks/useRedirection";
import { useEffect } from "react";
import { getWhoAmI } from "@/api/Users";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { FirebaseError } from "firebase/app";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import env from "@/util/validateEnv";

enum LoginPageError {
  NO_INTERNET,
  INVALID_CREDENTIALS,
  INTERNAL,
  TOO_MANY_REQUESTS,
  NONE,
}

interface ILoginFormInput {
  email: string;
  password: string;
}

/**
 * The root Login page component.
 */
const PasswordReset: React.FC = () => {
  const [passwordVisibleOne, setPasswordVisibleOne] = useState(false);
  const [passwordVisibleTwo, setPasswordVisibleTwo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(LoginPageError.NONE);

  useRedirectToHomeIfSignedIn();

  const { auth } = initFirebase();

  const { isMobile } = useScreenSizes();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ILoginFormInput>();

  const [passwordReset, setPasswordReset] = useState(false);

  const toggleReset = () => {
    setPasswordReset(!passwordReset);
  };

  /**
   * Fetch URL params once page loads
   */
  useEffect(() => {
    console.log("Fetching reset info");
    const urlParams = new URLSearchParams(window.location.search);
    const mode = urlParams.get("mode");
    const actionCode = urlParams.get("oobCode");
    const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS;

    const app = initializeApp(firebaseConfig);
    const auth = getAuth(app);

    console.log(actionCode);
    if (mode == "resetPassword") {
      // verify email
      if (actionCode != null) {
        verifyPasswordResetCode(auth, actionCode).then((email) => {
          console.log("Password reset code verified");
        });
      }
    }
  }, []);

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
  const onSubmit: SubmitHandler<ILoginFormInput> = async (data) => {
    try {
      setLoading(true);

      // Sign in to Firebase
      const userCredential = await signInWithEmailAndPassword(auth, data.email, data.password);

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

  /**
   * Prompts a link to be sent to the user with the given email
   */
  const sendResetLink: SubmitHandler<ILoginFormInput> = async (data) => {
    sendPasswordResetEmail(auth, data.email)
      .then(() => {
        console.log("Password reset email sent!");
      })
      .catch((error) => {
        console.error("Password reset email sending error: ", error);
      });
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

  return (
    <div className={styles.resetContainer}>
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
      <div className={styles.resetBox}>
        <div className={styles.resetText}>New Password</div>
        <div className={styles.instructions}>Set the new password for your account!</div>
        <form onSubmit={handleSubmit(sendResetLink)} className={styles.resetForm}>
          <div className={styles.inputGroup}>
            <TextField
              label="New Password"
              variant="outlined"
              placeholder="Enter"
              {...register("password", {
                required: "Password is required",
              })}
              required={false}
              error={!!errors.password}
              helperText={errors.password?.message}
              type={passwordVisibleOne ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setPasswordVisibleOne((prevVisible) => !prevVisible)}>
                    <Image
                      src={passwordVisibleOne ? "/ic_show.svg" : "/ic_hide.svg"}
                      alt={passwordVisibleOne ? "Show" : "Hide"}
                      width={17}
                      height={17}
                    />
                  </IconButton>
                ),
              }}
            />
            <div className={styles.spacer}></div>
            <TextField
              label="Confirm New Password"
              variant="outlined"
              placeholder="Enter"
              {...register("password", {
                required: "Password is required",
              })}
              required={false}
              error={!!errors.password}
              helperText={errors.password?.message}
              type={passwordVisibleTwo ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton onClick={() => setPasswordVisibleTwo((prevVisible) => !prevVisible)}>
                    <Image
                      src={passwordVisibleTwo ? "/ic_show.svg" : "/ic_hide.svg"}
                      alt={passwordVisibleTwo ? "Show" : "Hide"}
                      width={17}
                      height={17}
                    />
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className={styles.rememberPassword} onClick={toggleReset}>
            <a href="/login">Remember Old Password?</a>
          </div>
          <Button
            variant="primary"
            outlined={false}
            text="Confirm"
            loading={loading}
            type="submit"
            className={`${styles.confirmButton} ${isValid ? "" : styles.disabledButton}`}
          />
        </form>
      </div>
      {renderErrorNotification()}
    </div>
  );
};

export default PasswordReset;
