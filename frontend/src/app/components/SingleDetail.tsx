import React from "react";
import styles from "src/app/components/SingleDetail.module.css";

export interface SingleDetailProps {
  title: string;
  value: string;
}

export function SingleDetail({ title, value }: SingleDetailProps) {
  return (
    <div>
      <div className={styles.items}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value}>{value}</div>
      </div>
    </div>
  );
}
