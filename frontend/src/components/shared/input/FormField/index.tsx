import styles from "@/components/shared/input/FormField/styles.module.css";
import { ReactNode } from "react";

export interface FormFieldProps {
  label: string;
  required: boolean;
  error?: boolean;
  helperText?: string;
  children: ReactNode;
}

export const FormField = ({ label, required, error, helperText, children }: FormFieldProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p>
        {required ? <span className={styles.requiredAsterisk}>* </span> : null}
        {label}
      </p>
      {children}
      {helperText ? (
        <div className={`${styles.helperText} ${error ? styles.errorText : ""}`}>{helperText}</div>
      ) : null}
    </div>
  );
};
