import styles from "@/components/SearchKeyword.module.css";
import Image from "next/image";
import * as React from "react";

export default function SearchKeyword() {
  return (
    <div className={styles.search}>
      {/* image */}
      <Image width={24} height={24} src="/search.svg" alt="Search" className={styles.icons} />
      <input className={styles.searchInput} placeholder="Search Keyword..." />
    </div>
  );
}
