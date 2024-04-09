import React from "react";
import styles from "@/components/Profile/UserProfile/styles.module.css";
import Image from "next/image";
import { User } from "firebase/auth";

export interface UserProps {
  name: string;
  email: string;
}
export function UserProfile({ name, email }: UserProps) {
  return (
    <div className={styles.user}>
      {/* <div className={styles.image}> */}
      <Image
        className={styles.pfp}
        src="/Images/LoginImage.png"
        alt="Internal Error"
        width={93}
        height={93}
      />
      {/* </div> */}
      <div className={styles.row_justify}>
        <div className={styles.info}>
          <p className={styles.name}>{name}</p>
          <p className={styles.email}>{email}</p>
        </div>
        <Image
          src="/ic_settings.svg"
          alt="Internal Error"
          // width={isMobile ? 100 : 155}
          // height={isMobile ? 69 : 106}
          width={18}
          height={18}
        />
      </div>
    </div>
  );
}
