import React, { ReactNode } from "react";
import styles from "src/components/VSRIndividual/SingleDetail/styles.module.css";

export interface SingleDetailProps {
  title: string;
  value: string | number | number[] | ReactNode;
  valueFontSize?: string | number;
  className?: string;
}

export function SingleDetail({ title, value, valueFontSize, className }: SingleDetailProps) {
  const valueStyle = {
    fontSize: valueFontSize, // Use the passed font size or default to CSS class
  };

  const email = (
    <a className={styles.email} href={`mailto: ${value}`}>
      {value}
    </a>
  );

  const basic = (
    <div className={styles.value} style={valueStyle}>
      {value}
    </div>
  );

  const noValue = <div className={styles.noValue}>N/A</div>;

  return (
    <div>
      <div className={`${styles.items} ${className}`}>
        <div className={styles.title}>{title}</div>
        {typeof value === "string" && value.includes("@")
          ? email
          : typeof value === "string" && value.includes("N/A")
            ? noValue
            : basic}
      </div>
    </div>
  );
}
