import React from "react";
import styles from "@/components/VSRForm/PageNumber/styles.module.css";

export interface PageNumberProps {
  pageNum: number;
}

const PageNumber = ({ pageNum }: PageNumberProps) => {
  return (
    <div className={styles.pageNumber}>
      <p>Page {pageNum} of 3</p>
    </div>
  );
};

export default PageNumber;
