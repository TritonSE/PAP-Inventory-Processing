"use client";

import styles from "@/app/staff/profile/page.module.css";
import VSRTable from "@/components/VSRTable/VSRTable";
import SearchKeyword from "@/components/VSRTable/SearchKeyword";
import PageTitle from "@/components/VSRTable/PageTitle";
import HeaderBar from "@/components/shared/HeaderBar";
import Image from "next/image";
import React, { useContext, useEffect, useState } from "react";
import { StatusDropdown } from "@/components/shared/StatusDropdown";
import { useMediaQuery } from "@mui/material";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";
import { UserContext } from "@/contexts/userContext";
import { DeleteVSRsModal } from "@/components/shared/DeleteVSRsModal";
import { VSR, getAllVSRs } from "@/api/VSRs";
import { VSRErrorModal } from "@/components/VSRForm/VSRErrorModal";
import { useScreenSizes } from "@/hooks/useScreenSizes";
import { LoadingScreen } from "@/components/shared/LoadingScreen";
import { Button } from "@/components/shared/Button";
import { UserProfile } from "@/components/Profile/UserProfile";
import { User } from "firebase/auth";
import { AdminProfile } from "@/components/Profile/AdminProfile";

export default function Profile() {
  const { isMobile, isTablet } = useScreenSizes();

  //   useRedirectToLoginIfNotSignedIn();

  return (
    <div className={styles.page}>
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

        <UserProfile name="Justin Timberlake" email="justintimberlake@gmail.com"></UserProfile>
      </div>
    </div>
  );
}
