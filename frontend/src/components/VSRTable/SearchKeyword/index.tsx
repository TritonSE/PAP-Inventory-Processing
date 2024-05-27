import styles from "@/components/VSRTable/SearchKeyword/styles.module.css";
import Image from "next/image";
import React from "react";
import { debounce } from "@mui/material";

/**
 * A component for the Search input above the VSR table.
 */

interface SearchProps {
  onUpdate: (search: string) => void;
}

export const SearchKeyword = ({ onUpdate }: SearchProps) => {
  return (
    <div className={styles.search}>
      {/* image */}
      <Image width={24} height={24} src="/search.svg" alt="Search" className={styles.icons} />
      <input
        className={styles.searchInput}
        placeholder="Search Keyword..."
        onChange={debounce((e) => onUpdate(e.target.value), 250)}
      />
    </div>
  );
};
