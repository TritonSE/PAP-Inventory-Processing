"use client";

import styles from "@/app/staff/vsr/page.module.css";
import VSRTable from "@/components/VSRTable/VSRTable";
import SearchKeyword from "@/components/VSRTable/SearchKeyword";
import PageTitle from "@/components/VSRTable/PageTitle";
import HeaderBar from "@/components/shared/HeaderBar";
import Image from "next/image";
import React from "react";
import { StatusDropdown } from "@/components/VSRIndividual";

export default function VSRTableView() {
  return (
    <div className={styles.page}>
      <HeaderBar />
      <div className={styles.column}>
        <PageTitle />
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            <SearchKeyword />

            <div className={styles.statusContainer}>
              <p className={styles.statusLabel}>Status:</p>
              <div className={styles.statusWrapper}>
                <StatusDropdown value="Received" />
              </div>
            </div>
          </div>
          <div className={styles.row_right}>
            <button className={styles.buttons}>
              <Image width={24} height={24} src="/round-sort.svg" alt="Filter" />
              <text className={styles.buttontext}>Filter</text>
            </button>
            <button className={styles.buttons}>
              <Image width={24} height={24} src="/upload.svg" alt="Upload" />
              <text className={styles.buttontext}>Export</text>
            </button>
          </div>
        </div>
        <div className={styles.table}>
          <VSRTable />
        </div>
      </div>
    </div>
  );
}
