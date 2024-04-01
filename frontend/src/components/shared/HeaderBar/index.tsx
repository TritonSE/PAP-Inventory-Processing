import Image from "next/image";
import React, { useState } from "react";
import styles from "@/components/shared/HeaderBar/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { signOut } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { ErrorNotification } from "@/components/ErrorNotification";

interface HeaderBarProps {
  showLogoutButton: boolean;
}

const HeaderBar = ({ showLogoutButton }: HeaderBarProps) => {
  const { isTablet } = useScreenSizes();
  const { auth } = initFirebase();
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  const logout = () => {
    setErrorNotificationOpen(false);
    signOut(auth).catch((error) => {
      console.error(`Could not logout: ${error}`);
      setErrorNotificationOpen(true);
    });
  };

  return (
    <div className={styles.headerBar}>
      <Image width={isTablet ? 80 : 99} height={isTablet ? 39 : 48} src="/logo.svg" alt="logo" />
      {showLogoutButton ? (
        <button className={styles.logoutButton} onClick={logout}>
          Logout
        </button>
      ) : null}
      <ErrorNotification
        isOpen={errorNotificationOpen}
        mainText="Unable to Logout"
        subText="An error occurred while signing out, please check your internet connection or try again later"
        actionText="Dismiss"
        onActionClicked={() => setErrorNotificationOpen(false)}
      />
    </div>
  );
};

export default HeaderBar;
