import React from "react";
import styles from "src/components/TextField.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";

export interface TextFieldProps extends MUITextFieldProps<"outlined"> {
  label: string;
  error?: boolean;
  helperText?: string;
}

const TextField = ({ label, error = false, ...props }: TextFieldProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p className={styles.label}>{label}</p>
      <MUITextField className={styles.inputClass} {...props} />
    </div>
  );
};

export default TextField;
