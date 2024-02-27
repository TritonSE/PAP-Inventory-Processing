import styles from "@/components/SearchKeyword.module.css";
import Image from "next/image";
import * as React from "react";

export default function SearchKeyword() {
  return (
    <div className={styles.search}>
      {/* image */}
      <Image src="/search.svg" alt="Search" className={styles.icons} />
      <input className={styles.searchInput} placeholder="Search Keyword..." />
    </div>
  );
}
