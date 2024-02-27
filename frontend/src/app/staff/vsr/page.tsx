import styles from "@/app/staff/vsr/page.module.css";
import VSRTable from "@/components/VSRTable";
import StatusDropdown from "@/components/StatusDropdown";
import SearchKeyword from "@/components/SearchKeyword";
import PageTitle from "@/components/PageTitle";
import HeaderBar from "@/components/HeaderBar";
import Image from "next/image";
import React from "react";

export default function VSRTableView() {
  return (
    <div className={styles.page}>
      <HeaderBar></HeaderBar>
      <div className={styles.column}>
        <PageTitle></PageTitle>
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            <SearchKeyword></SearchKeyword>
            <StatusDropdown></StatusDropdown>
          </div>
          <div className={styles.row_right}>
            <div className={styles.buttons}>
              <Image width={24} height={24} src="/round-sort.svg" alt="Filter" />
              <text className={styles.buttontext}>Filter</text>
            </div>
            <div className={styles.buttons}>
              <Image width={24} height={24} src="/upload.svg" alt="Upload" />
              <text className={styles.buttontext}>Export</text>
            </div>
          </div>
        </div>
        <div className={styles.table}>
          <VSRTable></VSRTable>
        </div>
      </div>
    </div>
  );
}
