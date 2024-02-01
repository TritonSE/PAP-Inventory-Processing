import React from "react";
import styles from "src/app/components/HeaderBar.module.css";
import Image from "next/image";

export const HeaderBar = () => {
  return (
    <div className={styles.headerBar}>
      <Image className={styles.logo} width={99} height={48} src="/logo.svg" alt="logo" />
    </div>
  );
};
