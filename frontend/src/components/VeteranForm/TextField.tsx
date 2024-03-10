import styles from "src/components/VeteranForm/TextField.module.css";
import MUITextField, { TextFieldProps as MUITextFieldProps } from "@mui/material/TextField";
import { ForwardedRef, forwardRef, useRef, useState } from "react";

export interface TextFieldProps extends MUITextFieldProps<"outlined"> {
  label: string;
  error?: boolean;
  helperText?: string;
  required: boolean;
  onTextInputChange?: (arg0: string) => void;
}

const TextField = forwardRef(
  (
    { label, error, required, helperText, onTextInputChange, ...props }: TextFieldProps,
    ref: ForwardedRef<HTMLDivElement>,
  ) => {
    console.log(props);

    const [value, setValue] = useState("");

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
      if (onTextInputChange) {
        onTextInputChange(event.target.value);
      }
      setValue(event.target.value);
    };
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
          value={value}
          onChange={handleInputChange}
        />
        <div className={styles.helperText}>{helperText}</div>
      </div>
    );
  },
);
TextField.displayName = "TextField";
export default TextField;
