"use client";

import styles from "@/app/staff/vsr/page.module.css";
import VSRTable from "@/components/VSRTable/VSRTable";
import SearchKeyword from "@/components/VSRTable/SearchKeyword";
import PageTitle from "@/components/VSRTable/PageTitle";
import HeaderBar from "@/components/shared/HeaderBar";
import Image from "next/image";
import React from "react";
import { StatusDropdown } from "@/components/VSRIndividual";
import { useMediaQuery } from "@mui/material";
import { useRedirectToLoginIfNotSignedIn } from "@/hooks/useRedirection";

export default function VSRTableView() {
  const searchOnOwnRow = useMediaQuery("@media screen and (max-width: 1000px)");
  const buttonIconsOnly = useMediaQuery("@media screen and (max-width: 700px)");
  const buttonIconSize = buttonIconsOnly ? 16 : 24;

  useRedirectToLoginIfNotSignedIn();

  return (
    <div className={styles.page}>
      <HeaderBar showLogoutButton />
      <div className={styles.column}>
        <PageTitle />
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            {searchOnOwnRow ? null : <SearchKeyword />}

            <div className={styles.statusContainer}>
              <p className={styles.statusLabel}>Status:</p>
              <div className={styles.statusWrapper}>
                <StatusDropdown value="Received" />
              </div>
            </div>
          </div>
          <div className={styles.row_right}>
            <button className={styles.buttons}>
              <Image
                width={buttonIconSize}
                height={buttonIconSize}
                src="/round-sort.svg"
                alt="Filter"
              />
              {buttonIconsOnly ? null : <text className={styles.buttontext}>Filter</text>}
            </button>
            <button className={styles.buttons}>
              <Image
                width={buttonIconSize}
                height={buttonIconSize}
                src="/upload.svg"
                alt="Upload"
              />
              {buttonIconsOnly ? null : <text className={styles.buttontext}>Export</text>}
            </button>
          </div>
        </div>
        {searchOnOwnRow ? <SearchKeyword /> : null}
        <div className={styles.table}>
          <VSRTable />
        </div>
      </div>
    </div>
  );
}
