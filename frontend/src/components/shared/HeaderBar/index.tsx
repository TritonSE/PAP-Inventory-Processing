import Image from "next/image";
import React from "react";
import styles from "@/components/shared/HeaderBar/styles.module.css";

const HeaderBar = () => {
  return (
    <div className={styles.headerBar}>
      <Image className={styles.logo} width={99} height={48} src="/logo.svg" alt="logo" />
    </div>
  );
};

export default HeaderBar;
