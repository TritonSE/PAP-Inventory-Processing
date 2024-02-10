import React from "react";
import styles from "src/components/SingleDetail.module.css";

export interface SingleDetailProps {
  title: string;
  value: string | number | number[];
  valueFontSize?: string;
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

  const date = (
    <div className={styles.row}>
      <div className={styles.date} style={valueStyle}>
        {typeof value === "string" ? value.substring(0, 11) : value}
      </div>
      <div className={styles.time} style={valueStyle}>
        {typeof value === "string" ? value.substring(10) : value}
      </div>
    </div>
  );

  const basic = (
    <div className={styles.value} style={valueStyle}>
      {value}
    </div>
  );

  const noValue = <div className={styles.noValue}>N/A</div>;

  return (
    <div>
      <div className={className != undefined ? className : styles.items}>
        <div className={styles.title}>{title}</div>
        {typeof value === "string" && value.includes("[")
          ? date
          : typeof value === "string" && value.includes("@")
            ? email
            : typeof value === "string" && value.includes("N/A")
              ? noValue
              : basic}
      </div>
    </div>
  );
}
