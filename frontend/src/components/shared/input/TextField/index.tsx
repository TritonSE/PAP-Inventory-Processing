import styles from "@/components/shared/input/TextField/styles.module.css";
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
    return (
      <div className={styles.wrapperClass}>
        <p>
          {required ? <span className={styles.requiredAsterisk}>* </span> : null}
          {label}
        </p>
        <MUITextField
          ref={ref}
          fullWidth
          size="small"
          className={styles.inputClass}
          error={error}
          InputProps={{
            classes: {
              input: styles.input,
            },
          }}
          {...props}
        />
        {helperText ? (
          <div className={`${styles.helperText} ${error ? styles.errorText : ""}`}>
            {helperText}
          </div>
        ) : null}
      </div>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
