import React, { ReactNode } from "react";
import styles from "@/components/VSRIndividual/FieldDetails/SingleDetail/styles.module.css";
import { FieldDetail } from "@/components/VSRIndividual/FieldDetails/FieldDetail";

export interface SingleDetailProps {
  title: string;
  value: string | number | number[] | ReactNode;
  valueFontSize?: string | number;
  className?: string;
  isEmpty?: boolean;
}

/**
 * A component for a single (non-list) field on the VSR individual page.
 */
export function SingleDetail({
  title,
  value,
  valueFontSize,
  className,
  isEmpty,
}: SingleDetailProps) {
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

  const noValue = <div className={styles.noValue}>{value}</div>;

  return (
    <FieldDetail className={className} title={title}>
      {typeof value === "string" && value.includes("@")
        ? email
        : typeof value === "string" && isEmpty
          ? noValue
          : basic}
    </FieldDetail>
  );
}
