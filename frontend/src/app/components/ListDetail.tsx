import React from "react";
import styles from "src/app/components/ListDetail.module.css";

export interface ListDetailProps {
  title: string;
  values: string[];
}

export function ListDetail({ title, values }: ListDetailProps) {
  return (
    <div>
      <div className={styles.items}>
        <div className={styles.title}>{title}</div>
        <div className={styles.list}>
          {values.map((value, index) => (
            <div key={index} className={styles.listItem}>
              <div>{value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
