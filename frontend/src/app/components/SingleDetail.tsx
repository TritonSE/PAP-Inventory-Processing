import React from "react";
import styles from "src/app/components/SingleDetail.module.css";

export interface SingleDetailProps {
  title: string;
  value: string;
  valueFontSize?: string;
}

export function SingleDetail({ title, value, valueFontSize }: SingleDetailProps) {
  const valueStyle = {
    fontSize: valueFontSize, // Use the passed font size or default to CSS class
  };

  return (
    <div>
      <div className={styles.items}>
        <div className={styles.title}>{title}</div>
        <div className={styles.value} style={valueStyle}>
          {value}
        </div>
      </div>
    </div>
  );
}
