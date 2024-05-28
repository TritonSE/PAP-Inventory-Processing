import React from "react";
import styles from "@/components/Profile/OwnProfile/styles.module.css";
import { Avatar } from "@mui/material";

export interface AdminProps {
  name: string;
  email: string;
}
export function OwnProfile({ name, email }: AdminProps) {
  return (
    <div className={styles.root}>
      <Avatar style={{ width: 93, height: 93, fontSize: 48 }}>{name?.slice(0, 1)}</Avatar>
      <div className={styles.info_column}>
        <p className={styles.info_type}>Name</p>
        <p className={styles.info}>{name}</p>
      </div>
      <div className={styles.info_column_right}>
        <p className={styles.info_type}>Email Account</p>
        <p className={styles.info}>{email}</p>
      </div>
    </div>
  );
}
