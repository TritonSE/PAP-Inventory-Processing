import Image from "next/image";
import Link from "next/link";
import React, { useContext, useState } from "react";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { signOut } from "firebase/auth";
import { initFirebase } from "@/firebase/firebase";
import { Button } from "@/components/shared/Button";
import { NotificationBanner } from "@/components/shared/NotificationBanner";
import { UserContext } from "@/contexts/userContext";
import { Avatar, ClickAwayListener, Popper } from "@mui/material";
import styles from "@/components/shared/HeaderBar/styles.module.css";
import { ADMIN_ROLE } from "@/constants/roles";

interface HeaderBarProps {
  veteranVersion: boolean;
}

/**
 * A component that displays a header bar at the top of the screen and, optionally,
 * a logout button for staff and admins.
 */
const HeaderBar = ({ veteranVersion }: HeaderBarProps) => {
  const { firebaseUser, papUser } = useContext(UserContext);
  const { isTablet } = useScreenSizes();
  const { auth } = initFirebase();
  const [loading, setLoading] = useState(false);
  const [errorNotificationOpen, setErrorNotificationOpen] = useState(false);
  const [popupAnchor, setPopupAnchor] = useState<HTMLElement | null>(null);

  const logout = () => {
    if (loading) {
      return;
    }

    setErrorNotificationOpen(false);
    setLoading(true);
    signOut(auth)
      .catch((error) => {
        console.error(`Could not logout: ${error}`);
        setErrorNotificationOpen(true);
      })
      .finally(() => setLoading(false));
  };

  const menuOptions = [
    {
      iconSrc: "/ic_home.svg",
      iconAlt: "Home",
      text: "Dashboard",
      linkPath: "/staff/vsr",
    },
    {
      iconSrc: "/ic_profile.svg",
      iconAlt: "Profile",
      text: "Profile",
      linkPath: "/staff/profile",
    },
    ...(papUser?.role === ADMIN_ROLE
      ? [
          {
            iconSrc: "/furniture_items.svg",
            iconAlt: "Furniture Items",
            text: "Edit Furniture Items",
            linkPath: "/staff/furnitureItems",
          },
          {
            iconSrc: "/ic_email.svg",
            iconAlt: "Email",
            text: "Edit Email Template",
            linkPath: "/staff/emailTemplate",
          },
        ]
      : []),
    {
      iconSrc: "/logout.svg",
      iconAlt: "Logout",
      text: "Log Out",
      onClick: logout,
    },
  ];

  const renderMenuRow = (option: (typeof menuOptions)[number]) => (
    <div
      className={styles.menuRow}
      onClick={() => {
        option.onClick?.();
        setPopupAnchor(null);
      }}
      key={option.text}
    >
      <Image width={24} height={24} src={option.iconSrc} alt={option.iconAlt} />
      <p className={styles.menuText}>{option.text}</p>
    </div>
  );

  const renderMenuOption = (option: (typeof menuOptions)[number]) =>
    option.linkPath ? (
      <Link href={option.linkPath} key={option.text}>
        {renderMenuRow(option)}
      </Link>
    ) : (
      renderMenuRow(option)
    );

  return (
    <>
      <div className={styles.headerBar}>
        <Image width={isTablet ? 80 : 99} height={isTablet ? 39 : 48} src="/logo.svg" alt="logo" />
        {veteranVersion ? (
          <a href="mailto:veteran@patriotsandpaws.org">
            <Button
              variant="primary"
              outlined
              text="Contact Us"
              iconPath="/ic_simplehelp.svg"
              iconAlt="Help"
              hideTextOnMobile
              type="button"
            />
          </a>
        ) : (
          <Avatar
            variant="rounded"
            className={styles.avatar}
            onClick={(e) => setPopupAnchor(e.target as HTMLElement)}
          >
            {firebaseUser?.displayName?.slice(0, 1)}
          </Avatar>
        )}
      </div>

      {popupAnchor === null ? null : (
        <ClickAwayListener onClickAway={() => setPopupAnchor(null)}>
          <Popper anchorEl={popupAnchor} open={popupAnchor !== null} placement="bottom-end">
            <div className={styles.menuRoot}>{menuOptions.map(renderMenuOption)}</div>
          </Popper>
        </ClickAwayListener>
      )}

      <NotificationBanner
        variant="error"
        isOpen={errorNotificationOpen}
        mainText="Unable to Logout"
        subText="An error occurred while signing out, please check your internet connection or try again later"
        onDismissClicked={() => setErrorNotificationOpen(false)}
      />
    </>
  );
};

export default HeaderBar;
