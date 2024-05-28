import React from "react";
import styles from "@/components/Profile/UserProfile/styles.module.css";
import Image from "next/image";
import { Avatar } from "@mui/material";

export interface UserProps {
  name: string;
  email: string;
}
export function UserProfile({ name, email }: UserProps) {
  return (
    <div className={styles.root}>
      <Avatar style={{ width: 93, height: 93, fontSize: 48 }}>{name?.slice(0, 1)}</Avatar>
      <div className={styles.row}>
        <p className={styles.name}>{name}</p>
        <p className={styles.email}>{email}</p>
        <div />
      </div>
      <Image
        src="/ic_settings.svg"
        alt="Gear"
        width={24}
        height={24}
        className={styles.settingsIcon}
        onClick={() => {
          // TODO: show account options (delete acct/change pwd)
        }}
      />
    </div>
  );
}
