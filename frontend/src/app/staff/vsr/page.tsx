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
      {/* <text>Service Requests</text> */}
      <HeaderBar></HeaderBar>
      <div className={styles.column}>
        <div className={styles.row}>
          <PageTitle></PageTitle>
        </div>
        <div className={styles.row}>
          <div className={styles.row_half}>
            <SearchKeyword></SearchKeyword>
            <StatusDropdown></StatusDropdown>
          </div>
          {/* <div className={styles.row_half}>
            <text> </text>
          </div> */}
          <div className={styles.row_half}>
            <div className={styles.buttons}>
              <img width={24} height={24} src="/round-sort.svg" />
              <text className={styles.buttontext}>Sort</text>
            </div>
            <div className={styles.buttons}>
              <img width={24} height={24} src="/upload.svg" />
              <text className={styles.buttontext}>Export</text>
            </div>
          </div>
          {/* <TableButton></TableButton> */}
        </div>
        <div className={styles.table}>
          <VSRTable></VSRTable>
        </div>
      </div>
    </div>
  );
}
