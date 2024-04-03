import { ReactNode } from "react";
import styles from "@/components/VSRIndividual/FieldDetails/FieldDetail/styles.module.css";

interface FieldDetailProps {
  children: ReactNode;
  title: string;
  className?: string;
}

/**
 * A base component for a field detail on the VSR individual page, that renders a label
 * above the provided children.
 */
export const FieldDetail = ({ children, title, className }: FieldDetailProps) => {
  return (
    <div className={className != undefined ? className : styles.items}>
      <div className={styles.title}>{title}</div>
      {children}
    </div>
  );
};
