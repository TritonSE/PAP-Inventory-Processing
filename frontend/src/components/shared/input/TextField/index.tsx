import styles from "@/components/shared/input/TextField/styles.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";
import { ForwardedRef, forwardRef } from "react";
import { FormField } from "@/components/shared/input/FormField";
import { useScreenSizes } from "@/hooks/useScreenSizes";

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
    const { isMobile, isTablet } = useScreenSizes();

    return (
      <FormField label={label} required={required} error={error} helperText={helperText}>
        <MUITextField
          {...props}
          ref={ref}
          fullWidth
          size="small"
          className={styles.inputClass}
          error={error}
          InputProps={{
            sx: {
              ".MuiInputBase-input": {
                height: isMobile ? 16 : isTablet ? 19 : 22,
                padding: "6px 12px",
              },
              ".MuiInputBase-input::placeholder": {
                fontSize: isMobile ? 12 : isTablet ? 14 : 16,
                fontStyle: "italic",
                fontWeight: 300,
                color: "var(--Dark-Gray, #484848)",
              },
            },
            classes: {
              input: styles.input,
              ...(props.InputProps?.classes ?? {}),
            },
            ...(props.InputProps ?? {}),
          }}
        />
      </FormField>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
