import React from "react";
import styles from "@/components/VSRIndividual/HeaderBar/HeaderBar.module.css";
import Image from "next/image";

export const HeaderBar = () => {
  return (
    <div className={styles.headerBar}>
      <Image className={styles.logo} width={99} height={48} src="/logo.svg" alt="logo" />
      <div className={styles.profileButton}>
        <Image width={32} height={32} src="/user_ellipse.svg" alt="logo" />
        <Image width={10.5} height={5.5} src="/keyboard_arrow_down10.svg" alt="logo" />
      </div>
    </div>
  );
};
