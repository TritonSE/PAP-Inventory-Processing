import { ReactNode } from "react";
import styles from "src/components/VSRIndividual/FieldDetail/styles.module.css";

interface FieldDetailProps {
  children: ReactNode;
  title: string;
  className?: string;
}

export const FieldDetail = ({ children, title, className }: FieldDetailProps) => {
  return (
    <div>
      <div className={className != undefined ? className : styles.items}>
        <div className={styles.title}>{title}</div>
        {children}
      </div>
    </div>
  );
};
