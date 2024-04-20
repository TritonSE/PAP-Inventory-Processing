// HandlePasswordReset.tsx
"use client";

import React, { useState } from "react";
import Image from "next/image";
import styles from "@/app/handlePasswordReset/page.module.css";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { useRedirectToHomeIfSignedIn } from "@/hooks/useRedirection";
import { useEffect } from "react";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { IconButton } from "@mui/material";

enum LoginPageError {
  NO_INTERNET,
  INVALID_CREDENTIALS,
  INTERNAL,
  TOO_MANY_REQUESTS,
  NONE,
}

interface ILoginFormInput {
  newPassword: string;
  confirmPassword: string;
}

/**
 * The root Login page component.
 */
const PasswordReset: React.FC = () => {
  const [passwordVisibleOne, setPasswordVisibleOne] = useState(false);
  const [passwordVisibleTwo, setPasswordVisibleTwo] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [pageError, setPageError] = useState(LoginPageError.NONE);

  useRedirectToHomeIfSignedIn();

  const { auth } = initFirebase();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
  } = useForm<ILoginFormInput>();

  const [passwordReset, setPasswordReset] = useState(false);

  const toggleReset = () => {
    setPasswordReset(!passwordReset);
  };

  let urlParams: URLSearchParams, mode, actionCode: string | null;

  /**
   * Fetch URL params once page loads
   */
  useEffect(() => {
    console.log("Fetching reset info");
    urlParams = new URLSearchParams(window.location.search);
    mode = urlParams.get("mode");
    actionCode = urlParams.get("oobCode");
    // const firebaseConfig = env.NEXT_PUBLIC_FIREBASE_SETTINGS;

    // const app = initializeApp(firebaseConfig);
    // const auth = getAuth(app);

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
   * Prompts a link to be sent to the user with the given email
   */
  const resetPassword: SubmitHandler<ILoginFormInput> = async (data) => {
    if (data.newPassword == data.confirmPassword) {
      urlParams = new URLSearchParams(window.location.search);
      mode = urlParams.get("mode");
      actionCode = urlParams.get("oobCode");
      console.log("Passwords are the same: " + data.newPassword + ", " + data.confirmPassword);
      if (actionCode != null) {
        verifyPasswordResetCode(auth, actionCode)
          .then((email) => {
            if (actionCode != null) {
              confirmPasswordReset(auth, actionCode, data.newPassword)
                .then((resp) => {
                  console.log("Password has been reset");
                  signInWithEmailAndPassword(auth, email, data.newPassword);
                })
                .catch((error) => {
                  console.error("Confirm password reset failed: " + error);
                });
            }
          })
          .catch((error) => {
            console.error("Verify password reset code failed: " + error);
          });
      } else {
        console.log("action code null");
        // TODO: display error - passwords don't match
      }
    } else {
      setError(true);
    }
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
        <form onSubmit={handleSubmit(resetPassword)} className={styles.resetForm}>
          <div className={styles.inputGroup}>
            <TextField
              label="New Password"
              variant="outlined"
              placeholder="Enter"
              {...register("newPassword", {
                required: "New Password is required",
              })}
              required={false}
              error={!!errors.newPassword}
              helperText={errors.newPassword?.message}
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
              {...register("confirmPassword", {
                required: "Confirm Password is required",
              })}
              required={false}
              error={error}
              helperText={error ? "Passwords do not match" : errors.confirmPassword?.message}
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
