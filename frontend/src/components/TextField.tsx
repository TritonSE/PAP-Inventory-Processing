import React, { forwardRef } from "react";
import styles from "src/components/TextField.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";

export interface TextFieldProps extends MUITextFieldProps<"outlined"> {
  label: string;
  error?: boolean;
  helperText?: string;
}

const TextField = forwardRef(({ label, error = false, ...props }: TextFieldProps, ref) => {
  return (
    <div className={styles.wrapperClass}>
      <p className={styles.label}>{label}</p>
      <MUITextField className={styles.inputClass} inputRef={ref} {...props} />
    </div>
  );
});

export default TextField;
