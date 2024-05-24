// HandlePasswordReset.tsx
"use client";

import React, { Suspense, useState } from "react";
import Image from "next/image";
import {
  verifyPasswordResetCode,
  confirmPasswordReset,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { useRedirectToHomeIfSignedIn } from "@/hooks/useRedirection";
import { Button } from "@/components/shared/Button";
import TextField from "@/components/shared/input/TextField";
import { SubmitHandler, useForm } from "react-hook-form";
import { IconButton } from "@mui/material";
import { useSearchParams } from "next/navigation";
import { FirebaseError } from "firebase/app";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import styles from "@/app/handlePasswordReset/page.module.css";

enum ResetPasswordPageError {
  NO_INTERNET,
  INVALID_CREDENTIALS,
  UNKNOWN_MODE,
  INVALID_CODE,
  WEAK_PASSWORD,
  INTERNAL,
  TOO_MANY_REQUESTS,
  NONE,
}

interface IResetPasswordFormInput {
  newPassword: string;
  confirmPassword: string;
}

const OOB_CODE_URL_PARAM = "oobCode";
const MODE_URL_PARAM = "mode";
const RESET_PASSWORD_MODE = "resetPassword";

/**
 * The root Reset Password page component.
 */
const PasswordReset: React.FC = () => {
  const [newPasswordVisible, setNewPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pageError, setPageError] = useState(ResetPasswordPageError.NONE);
  const [pageErrorText, setPageErrorText] = useState("");

  useRedirectToHomeIfSignedIn();

  const { auth } = initFirebase();

  const {
    handleSubmit,
    register,
    formState: { errors, isValid },
    watch,
  } = useForm<IResetPasswordFormInput>();

  const searchParams = useSearchParams();

  /**
   * Prompts a link to be sent to the user with the given email
   */
  const resetPassword: SubmitHandler<IResetPasswordFormInput> = async (data) => {
    setLoading(true);

    const mode = searchParams.get(MODE_URL_PARAM);

    if (mode !== RESET_PASSWORD_MODE) {
      setPageError(ResetPasswordPageError.UNKNOWN_MODE);
      setLoading(false);
      return;
    }

    const oobCode = searchParams.get(OOB_CODE_URL_PARAM);

    let email;

    try {
      email = await verifyPasswordResetCode(auth, oobCode ?? "");
    } catch (error) {
      console.error(`Verifying password reset code ${oobCode} failed with error: `, error);

      switch ((error as FirebaseError)?.code) {
        case "auth/network-request-failed":
          setPageError(ResetPasswordPageError.NO_INTERNET);
          break;
        case "auth/invalid-action-code":
          setPageError(ResetPasswordPageError.INVALID_CODE);
          break;
        default:
          setPageError(ResetPasswordPageError.INTERNAL);
          break;
      }
      setLoading(false);
      return;
    }

    try {
      await confirmPasswordReset(auth, oobCode ?? "", data.newPassword);
    } catch (error) {
      console.error("Password reset failed with error: ", error);

      switch ((error as FirebaseError)?.code) {
        case "auth/weak-password":
          setPageError(ResetPasswordPageError.WEAK_PASSWORD);
          setPageErrorText((error as FirebaseError)?.message);
          break;
        case "auth/network-request-failed":
          setPageError(ResetPasswordPageError.NO_INTERNET);
          break;
        default:
          setPageError(ResetPasswordPageError.INTERNAL);
          break;
      }
      setLoading(false);
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, data.newPassword);
    } catch (error) {
      console.error("Firebase login failed with error: ", error);

      switch ((error as FirebaseError)?.code) {
        case "auth/network-request-failed":
          setPageError(ResetPasswordPageError.NO_INTERNET);
          break;
        case "auth/too-many-requests":
          setPageError(ResetPasswordPageError.TOO_MANY_REQUESTS);
          break;
        default:
          setPageError(ResetPasswordPageError.INTERNAL);
          break;
      }
    } finally {
      setLoading(false);
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
      case ResetPasswordPageError.NO_INTERNET:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="No Internet Connection"
            subText="Unable to reset password due to no internet connection. Please check your connection and try again."
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case ResetPasswordPageError.INVALID_CREDENTIALS:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Invalid Credentials"
            subText="Invalid password, please try again."
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case ResetPasswordPageError.UNKNOWN_MODE:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Unknown Mode"
            subText='Unknown value for "mode" URL parameter'
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case ResetPasswordPageError.INVALID_CODE:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Invalid Link"
            subText="Invalid reset password link. Link may have expired."
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case ResetPasswordPageError.WEAK_PASSWORD:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Weak Password"
            subText={`Password is too weak: ${pageErrorText}`}
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case ResetPasswordPageError.TOO_MANY_REQUESTS:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Too Many Requests"
            subText="You have made too many reset password attempts. Please try again later."
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
            style={errorNotificationStyles}
          />
        );
      case ResetPasswordPageError.INTERNAL:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Internal Error"
            subText="Something went wrong with resetting your password. Our team is working to fix it. Please try again later."
            onDismissClicked={() => setPageError(ResetPasswordPageError.NONE)}
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
              type={newPasswordVisible ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setNewPasswordVisible((prevVisible) => !prevVisible)}
                    className={styles.visibilityButton}
                  >
                    <Image
                      src={newPasswordVisible ? "/ic_show.svg" : "/ic_hide.svg"}
                      alt={newPasswordVisible ? "Show" : "Hide"}
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
                validate: {
                  validate: (confirmPassword) =>
                    confirmPassword === watch().newPassword || "Passwords do not match",
                },
              })}
              required={false}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              type={confirmPasswordVisible ? "text" : "password"}
              InputProps={{
                endAdornment: (
                  <IconButton
                    onClick={() => setConfirmPasswordVisible((prevVisible) => !prevVisible)}
                    className={styles.visibilityButton}
                  >
                    <Image
                      src={confirmPasswordVisible ? "/ic_show.svg" : "/ic_hide.svg"}
                      alt={confirmPasswordVisible ? "Show" : "Hide"}
                      width={17}
                      height={17}
                    />
                  </IconButton>
                ),
              }}
            />
          </div>
          <div className={styles.rememberPassword}>
            <a href="/login">Remembered Old Password?</a>
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

const PasswordResetPage = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <PasswordReset />
    </Suspense>
  );
};

export default PasswordResetPage;
