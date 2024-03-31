import Image from "next/image";
import React from "react";
import styles from "@/components/shared/HeaderBar/styles.module.css";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { signOut } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";

interface HeaderBarProps {
  showLogoutButton: boolean;
}

const HeaderBar = ({ showLogoutButton }: HeaderBarProps) => {
  const { isTablet } = useScreenSizes();
  const { auth } = initFirebase();

  const logout = () => {
    signOut(auth).catch((error) => {
      // TODO: better error handling
      console.error(`Could not logout: ${error}`);
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
    </div>
  );
};

export default HeaderBar;
