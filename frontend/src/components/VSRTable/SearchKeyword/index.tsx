import styles from "@/components/VSRTable/SearchKeyword/styles.module.css";
import Image from "next/image";
import React, { useState } from "react";

/**
 * A component for the Search input above the VSR table.
 */

interface SearchProps {
  onUpdate: (search: string) => void;
}

export const SearchKeyword = ({ onUpdate }: SearchProps) => {
  const [searchInput, setSearchInput] = useState("");

  const handleInputChange = (event: { target: { value: string } }) => {
    const input = event.target.value;
    setSearchInput(input);
    onUpdate(input);
  };

  return (
    <div className={styles.search}>
      {/* image */}
      <Image width={24} height={24} src="/search.svg" alt="Search" className={styles.icons} />
      <input
        className={styles.searchInput}
        placeholder="Search Keyword..."
        value={searchInput}
        onChange={handleInputChange}
      />
    </div>
  );
};
