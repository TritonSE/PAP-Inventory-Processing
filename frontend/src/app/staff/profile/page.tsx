"use client";

import styles from "@/app/staff/profile/page.module.css";
import HeaderBar from "@/components/shared/HeaderBar";
import React, { useContext, useState } from "react";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { Button } from "@/components/shared/Button";
import { UserProfile } from "@/components/Profile/UserProfile";
import { AdminProfile } from "@/components/Profile/AdminProfile";
import { DisplayUser, getAllUsers } from "@/api/Users";
import { UserContext } from "@/contexts/userContext";
enum AllUsersError {
  CANNOT_FETCH_USERS_NO_INTERNET,
  CANNOT_FETCH_USERS_INTERNAL,
  NONE,
}

export default function Profile() {
  const { isMobile, isTablet } = useScreenSizes();
  const { firebaseUser, papUser } = useContext(UserContext);
  const [users, setUsers] = useState<DisplayUser[]>([]);
  // const [userError, setUserError] = useState<AllUsersError>(AllUsersError.NONE);

  firebaseUser?.getIdToken().then((firebaseToken) => {
    getAllUsers(firebaseToken).then((result) => {
      if (result.success) {
        setUsers(result.data);
        console.log(result.data);
      } else {
        // setUserError(AllUsersError.CANNOT_FETCH_USERS_INTERNAL);
        // console.log(userError);
      }
    });
  });

  //   useRedirectToLoginIfNotSignedIn();

  return (
    <div>
      <HeaderBar showLogoutButton />
      <div className={styles.main}>
        <h1 className={styles.title}>Account</h1>
        <h1 className={styles.subtitle}>User Profile</h1>
        {/* ACCOUNT INFO */}
        <AdminProfile name="Justine Roberts" email="justineroberts@gmail.com"></AdminProfile>
        <div className={styles.row}>
          <h1 className={styles.subtitle}>Manage Users</h1>
          <Button
            variant="primary"
            outlined
            iconPath="/icon_plus.svg"
            iconAlt="Add"
            text="Add Account"
            hideTextOnMobile
            // onClick={() => setDeleteVsrModalOpen(true)}
          />
        </div>
        {/* <UserProfile name="Justin Timberlake" email="justintimberlake@gmail.com"></UserProfile> */}
        {users.map((user, index) =>
          user.uid != firebaseUser?.uid ? (
            <UserProfile
              key={index}
              email={user.email}
              name={user.displayName}
              photoURL={user.photoURL}
            ></UserProfile>
          ) : null,
        )}
      </div>
    </div>
  );
}
