"use client";

import HeaderBar from "@/components/shared/HeaderBar";
import React, { useContext, useEffect, useState } from "react";
import { Button } from "@/components/shared/Button";
import { UserProfile } from "@/components/Profile/UserProfile";
import { OwnProfile } from "@/components/Profile/OwnProfile";
import { DisplayUser, getAllUsers } from "@/api/Users";
import { UserContext } from "@/contexts/userContext";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import styles from "@/app/staff/profile/page.module.css";
import { ADMIN_ROLE } from "@/constants/roles";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import { CreateUserModal } from "@/components/Profile/CreateUserModal";

enum AllUsersError {
  NO_INTERNET,
  INTERNAL,
  NONE,
}

export default function Profile() {
  const {
    firebaseUser,
    papUser,
    successNotificationOpen,
    setSuccessNotificationOpen,
    errorNotificationOpen,
    setErrorNotificationOpen,
  } = useContext(UserContext);
  const [users, setUsers] = useState<DisplayUser[]>();
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [usersError, setUsersError] = useState<AllUsersError>(AllUsersError.NONE);
  const [createUserModalOpen, setCreateUserModalOpen] = useState(false);

  const fetchUsers = async () => {
    if (!firebaseUser || !papUser || papUser.role !== ADMIN_ROLE) {
      return;
    }

    setLoadingUsers(true);
    setUsersError(AllUsersError.NONE);
    const firebaseToken = await firebaseUser.getIdToken();
    const result = await getAllUsers(firebaseToken);
    if (result.success) {
      setUsers(result.data);
    } else {
      if (result.error === "Failed to fetch") {
        setUsersError(AllUsersError.NO_INTERNET);
      } else {
        console.error(`Cannot retrieve users: error ${result.error}`);
        setUsersError(AllUsersError.INTERNAL);
      }
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [firebaseUser, papUser]);

  useEffect(() => {
    setSuccessNotificationOpen(null);
    setErrorNotificationOpen(null);
  }, []);

  useRedirectToLoginIfNotSignedIn();

  const renderErrorNotification = () => {
    switch (usersError) {
      case AllUsersError.NO_INTERNET:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="No Internet Connection"
            subText="Unable to retrieve users due to no internet connection. Please check your connection and try again."
            onDismissClicked={() => setUsersError(AllUsersError.NONE)}
          />
        );
      case AllUsersError.INTERNAL:
        return (
          <NotificationBanner
            variant="error"
            isOpen
            mainText="Internal Error"
            subText="Something went wrong with retrieving all users. Our team is working to fix it. Please try again later."
            onDismissClicked={() => setUsersError(AllUsersError.NONE)}
          />
        );
    }
  };

  return (
    <div>
      <HeaderBar veteranVersion={false} />
      {loadingUsers ? (
        <LoadingScreen />
      ) : (
        <div className={styles.main}>
          <h1 className={styles.title}>Account Settings</h1>
          <h1 className={styles.subtitle}>User Profile</h1>

          {/* ACCOUNT INFO */}
          <OwnProfile name={firebaseUser?.displayName ?? ""} email={firebaseUser?.email ?? ""} />
          {papUser?.role === ADMIN_ROLE ? (
            <>
              <div className={styles.row}>
                <h1 className={styles.subtitle}>Manage Users</h1>
                <Button
                  variant="primary"
                  outlined
                  iconPath="/icon_plus.svg"
                  iconAlt="Add"
                  text="Add Account"
                  hideTextOnMobile
                  onClick={() => setCreateUserModalOpen(true)}
                />
              </div>
              {users?.map((user, index) =>
                user.uid != firebaseUser?.uid ? (
                  <UserProfile
                    key={index}
                    afterChangeUser={fetchUsers}
                    uid={user.uid}
                    email={user.email ?? ""}
                    name={user.displayName ?? ""}
                  />
                ) : null,
              )}
            </>
          ) : null}
        </div>
      )}
      {renderErrorNotification()}

      <CreateUserModal
        isOpen={createUserModalOpen}
        onClose={() => setCreateUserModalOpen(false)}
        afterCreateUser={fetchUsers}
      />

      <NotificationBanner
        variant="success"
        isOpen={successNotificationOpen !== null}
        mainText={
          successNotificationOpen === "deleteUser"
            ? "User Successfully Deleted"
            : "Password Changed Successfully"
        }
        onDismissClicked={() => setSuccessNotificationOpen(null)}
      />
      <NotificationBanner
        variant="error"
        isOpen={errorNotificationOpen !== null}
        mainText={
          errorNotificationOpen === "deleteUser"
            ? "Unable to Delete User"
            : "Unable to Change password"
        }
        subText="An error occurred, please check your internet connection or try again later"
        onDismissClicked={() => setErrorNotificationOpen(null)}
      />
    </div>
  );
}
