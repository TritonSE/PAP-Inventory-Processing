import styles from "src/components/VeteranForm/TextField.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";
import { ForwardedRef, forwardRef } from "react";

export interface TextFieldProps extends MUITextFieldProps<"outlined"> {
  label: string;
  error?: boolean;
  helperText?: string;
  required: boolean;
}

const TextField = forwardRef(
  (
    { label, error, required, helperText, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    console.log(props);
    return (
      <div className={styles.wrapperClass}>
        <p>
          {required && <span className={styles.requiredAsterisk}>* </span>}
          {label}
        </p>
        <MUITextField
          ref={ref}
          fullWidth={true}
          size="small"
          className={styles.inputClass}
          error={error}
          {...props}
          defaultValue="Please list"
        />
        <div className={styles.helperText}>{helperText}</div>
      </div>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
