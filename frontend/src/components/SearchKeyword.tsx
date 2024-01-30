import * as React from "react";
import styles from "src/components/SearchKeyword.module.css";

export default function SearchKeyword() {
  return (
    <div className={styles.search}>
      {/* image */}
      <img src="/search.svg" className={styles.icons}></img>
      <input className={styles.searchInput} placeholder="Search Keyword..." />
    </div>
  );
}
