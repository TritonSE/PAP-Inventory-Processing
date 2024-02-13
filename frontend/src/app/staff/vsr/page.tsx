import React from "react";
import VSRTable from "@/components/VSRTable";
// import {Helmet} from 'react-helmet';
// import Helmet from "helmet";
import styles from "src/app/staff/vsr/page.module.css";
import StatusDropdown from "@/components/StatusDropdown";
import SearchKeyword from "@/components/SearchKeyword";
import PageTitle from "@/components/PageTitle";
import { HeaderBar } from "@/components/HeaderBar";
import TableButton from "@/components/TableButton";

export default function VSRTableView() {
  return (
    <div className={styles.page}>
      <HeaderBar></HeaderBar>
      <div className={styles.column}>
        <div className={styles.title_row}>
          <PageTitle></PageTitle>
        </div>
        <div className={styles.button_row}>
          <div className={styles.row_left}>
            <SearchKeyword></SearchKeyword>
            <StatusDropdown></StatusDropdown>
          </div>
          <div className={styles.row_right}>
            <div className={styles.buttons}>
              <img width={24} height={24} src="/round-sort.svg" />
              <text className={styles.buttontext}>Filter</text>
            </div>
            <div className={styles.buttons}>
              <img width={24} height={24} src="/upload.svg" />
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
