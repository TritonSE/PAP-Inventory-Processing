import React from "react";
import styles from "src/components/VeteranForm/PageNumber.module.css";

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
