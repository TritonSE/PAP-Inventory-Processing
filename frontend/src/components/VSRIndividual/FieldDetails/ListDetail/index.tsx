import React from "react";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";
import styles from "@/components/VSRIndividual/FieldDetails/ListDetail/styles.module.css";

export interface ListDetailProps {
  title: string;
  values: string[];
  isEmpty: boolean;
}

/**
 * A component that displays a list of values separated by commas on the VSR individual page.
 */
export function ListDetail({ title, values, isEmpty }: ListDetailProps) {
  const list = (
    <div className={styles.list}>
      {values.map((value, index) => (
        <div key={index} className={styles.listItem}>
          <div>{value}</div>
        </div>
      ))}
    </div>
  );
  const noList = <div className={styles.noList}>{values[0]}</div>;

  return <FieldDetail title={title}>{isEmpty ? noList : list}</FieldDetail>;
}
