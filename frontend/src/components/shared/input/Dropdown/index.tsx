import React from "react";
import styles from "@/components/shared/input/Dropdown/styles.module.css";
import { FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";

export interface DropDownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
  placeholder?: string;
}

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  required,
  error,
  helperText,
  placeholder,
}: DropDownProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p>
        {required ? <span className={styles.requiredAsterisk}>* </span> : null}
        {label}
      </p>
      <FormControl className={styles.form} size="small">
        <Select
          className={styles.Dropdown}
          value={value}
          onChange={onChange}
          error={error}
          displayEmpty
          fullWidth
          renderValue={(value) =>
            value === "" ? <p className={styles.placeholder}> {placeholder}</p> : value
          }
        >
          <MenuItem value="">
            <p className={styles.placeholder}>{placeholder}</p>
          </MenuItem>
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {helperText ? <div className={styles.helperText}>{helperText}</div> : null}
    </div>
  );
};

export default Dropdown;
