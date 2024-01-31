import React, { forwardRef } from "react";
import styles from "src/components/TextField.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";

export interface TextFieldProps extends MUITextFieldProps<"outlined"> {
  label: string;
  error?: boolean;
  helperText?: string;
}

const TextField = ({ label, error, helperText, ...props }: TextFieldProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p className={styles.label}>{label}</p>
      <MUITextField className={styles.inputClass} error={error} {...props} />
    </div>
  );
};

export default TextField;
