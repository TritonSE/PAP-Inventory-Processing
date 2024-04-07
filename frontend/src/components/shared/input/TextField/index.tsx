import styles from "@/components/shared/input/TextField/styles.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";
import { ForwardedRef, forwardRef } from "react";
import { FormField } from "@/components/shared/input/FormField";

export interface TextFieldProps extends MUITextFieldProps<"outlined"> {
  label: string;
  error?: boolean;
  helperText?: string;
  required: boolean;
}

/**
 * A text input field component
 */
const TextField = forwardRef(
  (
    { label, error, required, helperText, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    return (
      <FormField label={label} required={required} error={error} helperText={helperText}>
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
      </FormField>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
