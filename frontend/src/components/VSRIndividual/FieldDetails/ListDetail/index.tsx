import React from "react";
import styles from "@/components/VSRIndividual/FieldDetails/ListDetail/styles.module.css";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";

export interface ListDetailProps {
  title: string;
  values: string[];
}

/**
 * A component that displays a list of values separated by commas on the VSR individual page.
 */
export function ListDetail({ title, values }: ListDetailProps) {
  const list = (
    <div className={styles.list}>
      {values.map((value, index) => (
        <div key={index} className={styles.listItem}>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
  const noList = <div className={styles.noList}>N/A</div>;

  return <FieldDetail title={title}>{values.includes("N/A") ? noList : list}</FieldDetail>;
}
