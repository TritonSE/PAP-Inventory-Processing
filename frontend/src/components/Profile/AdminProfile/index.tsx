import React from "react";
import styles from "@/components/Profile/AdminProfile/styles.module.css";
import Image from "next/image";
import { User } from "firebase/auth";

export interface AdminProps {
  name: string;
  email: string;
}
export function AdminProfile({ name, email }: AdminProps) {
  return (
    <div className={styles.admin}>
      <div className={styles.column}>
        <div className={styles.row_justify}>
          <h1 className={styles.subtitle}>Account Information</h1>
          <Image
            src="/ic_settings.svg"
            alt="Internal Error"
            // width={isMobile ? 100 : 155}
            // height={isMobile ? 69 : 106}
            width={18}
            height={18}
          />{" "}
        </div>
        <div className={styles.row}>
          <Image
            className={styles.pfp}
            src="/Images/LoginImage.png"
            alt="Internal Error"
            width={93}
            height={93}
          />
          <div className={styles.info_column}>
            <p className={styles.info_type}>Name</p>
            <p className={styles.info}>{name}</p>
          </div>
          <div className={styles.info_column_right}>
            <p className={styles.info_type}>Email Account</p>
            <p className={styles.info}>{email}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
