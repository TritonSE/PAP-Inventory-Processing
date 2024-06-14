import emailValidator from "email-validator";
import Image from "next/image";
import { useContext, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { BaseModal } from "@/components/shared/BaseModal";
import { CreateUserRequest, createUser } from "@/api/Users";
import { UserContext } from "@/contexts/userContext";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import TextField from "@/components/shared/input/TextField";
import { IconButton } from "@mui/material";
import { Button } from "@/components/shared/Button";
import styles from "@/components/Profile/CreateUserModal/styles.module.css";

interface ICreateUserFormInput {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

interface CreateUserModalProps {
  isOpen: boolean;
  onClose: () => unknown;
  afterCreateUser: () => unknown;
}

export const CreateUserModal = ({ isOpen, onClose, afterCreateUser }: CreateUserModalProps) => {
  const { firebaseUser } = useContext(UserContext);
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [successNotificationOpen, setSuccessNotificationOpen] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors, isValid },
    watch,
  } = useForm<ICreateUserFormInput>();

  const onSubmit: SubmitHandler<ICreateUserFormInput> = async (data) => {
    setLoading(true);
    setSuccessNotificationOpen(false);
    setErrorNotificationOpen(false);

    const createUserRequest: CreateUserRequest = {
      name: data.name,
      email: data.email,
      password: data.password,
    };

    const firebaseToken = await firebaseUser?.getIdToken();
    const result = await createUser(firebaseToken!, createUserRequest);
    if (result.success) {
      setSuccessNotificationOpen(true);
    } else {
      console.error(`Creating user failed with error: ${result.error}`);
      setErrorNotificationOpen(true);
    }
    setLoading(false);
    reset();
    afterCreateUser();
    onClose();
  };

  return (
    <>
      <BaseModal
        isOpen={isOpen}
        onClose={onClose}
        title="Create Account"
        content={
          <div className={styles.root}>
            <p className={styles.subtitle}>
              Invite a new staff member by entering their information below!
            </p>
            <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
              <TextField
                label="Name"
                variant="outlined"
                placeholder="Justine Roberts"
                {...register("name", {
                  required: "Name is required",
                })}
                required={false}
                error={!!errors.name}
                helperText={errors.name?.message}
              />

              <TextField
                label="Email"
                variant="outlined"
                placeholder="e.g. johndoe@gmail.com"
                {...register("email", {
                  required: "Email is required",
                  validate: {
                    validate: (emailAddress) =>
                      emailValidator.validate(emailAddress) ||
                      "This field must be a valid email address",
                  },
                })}
                required={false}
                error={!!errors.email}
                helperText={errors.email?.message}
              />

              <TextField
                label="Password"
                variant="outlined"
                placeholder="Enter Password"
                {...register("password", {
                  required: "Password is required",

                  validate: {
                    validate: (password) =>
                      password.length >= 6 || "Password must be at least 6 characters",
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
                label="Confirm Password"
                variant="outlined"
                placeholder="Re-enter Password"
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
                text="Create User"
                loading={loading}
                type="submit"
                className={`${styles.submitButton} ${isValid ? "" : styles.disabledButton}`}
              />
            </form>
          </div>
        }
        bottomRow={null}
      />

      <NotificationBanner
        variant="success"
        isOpen={successNotificationOpen}
        mainText="User created successfully"
        onDismissClicked={() => setSuccessNotificationOpen(false)}
      />
      <NotificationBanner
        variant="error"
        isOpen={errorNotificationOpen}
        mainText="Error creating user"
        subText="Could not create user, please try again."
        onDismissClicked={() => setErrorNotificationOpen(false)}
      />
    </>
  );
};
