import Image from "next/image";
import React, { useState } from "react";
import styles from "@/components/shared/HeaderBar/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { signOut } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { ErrorNotification } from "@/components/Errors/ErrorNotification";
import { Button } from "@/components/shared/Button";

interface HeaderBarProps {
  showLogoutButton: boolean;
}

/**
 * A component that displays a header bar at the top of the screen and, optionally,
 * a logout button for staff and admins.
 */
const HeaderBar = ({ showLogoutButton }: HeaderBarProps) => {
  const { isTablet } = useScreenSizes();
  const { auth } = initFirebase();
  const [loading, setLoading] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);

  const logout = () => {
    setErrorNotificationOpen(false);
    setLoading(true);
    signOut(auth)
      .catch((error) => {
        console.error(`Could not logout: ${error}`);
        setErrorNotificationOpen(true);
      })
      .finally(() => setLoading(false));
  };

  return (
    <div className={styles.headerBar}>
      <Image width={isTablet ? 80 : 99} height={isTablet ? 39 : 48} src="/logo.svg" alt="logo" />
      {showLogoutButton ? (
        <Button
          variant="primary"
          outlined={false}
          text="Logout"
          loading={loading}
          onClick={logout}
        />
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
