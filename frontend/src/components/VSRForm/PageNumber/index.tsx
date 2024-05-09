import React from "react";
import styles from "@/components/VSRForm/PageNumber/styles.module.css";

export interface PageNumberProps {
  pageNum: number;
}

/**
 * A component that displays the current page number of the VSR form.
 */
const PageNumber = ({ pageNum }: PageNumberProps) => {
  return (
    <div className={styles.pageNumber}>
      <p>{pageNum < 4 ? pageNum + "of 3" : ""}</p>
    </div>
  );
};

export default PageNumber;
