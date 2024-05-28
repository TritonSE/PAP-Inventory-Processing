import Image from "next/image";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BaseModal } from "@/components/shared/BaseModal";
import { changeUserPassword } from "@/api/Users";
import { UserContext } from "@/contexts/userContext";
import TextField from "@/components/shared/input/TextField";
import { IconButton } from "@mui/material";
import { Button } from "@/components/shared/Button";
import styles from "@/components/Profile/ChangePasswordModal/styles.module.css";

interface IChangePasswordFormInput {
  password: string;
  confirmPassword: string;
}

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  uid: string;
  afterChangePassword: () => unknown;
}

export const ChangePasswordModal = ({
  isOpen,
  onClose,
  uid,
  afterChangePassword,
}: ChangePasswordModalProps) => {
  const { firebaseUser, setSuccessNotificationOpen, setErrorNotificationOpen } =
    useContext(UserContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<IChangePasswordFormInput>();

  const onSubmit: SubmitHandler<IChangePasswordFormInput> = async (data) => {
    setLoading(true);
    setSuccessNotificationOpen(null);
    setErrorNotificationOpen(null);

    const firebaseToken = await firebaseUser?.getIdToken();
    const result = await changeUserPassword(uid, data.password, firebaseToken!);
    if (result.success) {
      setSuccessNotificationOpen("changePassword");
    } else {
      console.error(`Changing password failed with error: ${result.error}`);
      setErrorNotificationOpen("changePassword");
    }
    setLoading(false);
    reset();
    afterChangePassword();
    onClose();
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Change User's Password"
        content={
          <div className={styles.root}>
            <p className={styles.subtitle}>Change this user’s login credentials</p>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <TextField
                label="New Password"
                variant="outlined"
                placeholder="Enter New Password"
                {...register("password", {
                  required: "New password is required",

                  validate: {
                    validate: (password) =>
                      password.length >= 6 || "New password must be at least 6 characters",
                  },
                })}
                required={false}
                error={!!errors.password}
                helperText={errors.password?.message}
                type={passwordVisible ? "text" : "password"}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setPasswordVisible((prevVisible) => !prevVisible)}
                      className={styles.visibilityButton}
                    >
                      <Image
                        src={passwordVisible ? "/ic_show.svg" : "/ic_hide.svg"}
                        alt={passwordVisible ? "Show" : "Hide"}
                        width={17}
                        height={17}
                      />
                    </IconButton>
                  ),
                }}
              />

              <TextField
                label="Confirm New Password"
                variant="outlined"
                placeholder="Re-enter New Password"
                {...register("confirmPassword", {
                  required: "Confirm Password is required",
                  validate: {
                    validate: (confirmPassword) =>
                      confirmPassword === watch().password || "Passwords do not match",
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

              <Button
                variant="primary"
                outlined={false}
                text="Change Password"
                loading={loading}
                type="submit"
                className={`${styles.submitButton} ${isValid ? "" : styles.disabledButton}`}
              />
            </form>
          </div>
        }
        bottomRow={null}
      />
    </>
  );
};
