import Image from "next/image";
import React from "react";
import styles from "@/components/shared/HeaderBar/styles.module.css";
import { useScreenSizes } from "@/util/useScreenSizes";

const HeaderBar = () => {
  const { isTablet } = useScreenSizes();
  return (
    <div className={styles.headerBar}>
      <Image
        className={styles.logo}
        width={isTablet ? 80 : 99}
        height={isTablet ? 39 : 48}
        src="/logo.svg"
        alt="logo"
      />
    </div>
  );
};

export default HeaderBar;
