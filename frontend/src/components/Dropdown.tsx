import React from "react";
import styles from "src/components/Dropdown.module.css";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

export interface DropDownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  required: boolean;
  error?: boolean;
  helperText?: string;
}

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  required,
  error,
  helperText,
}: DropDownProps) => {
  return (
    <div className={styles.wrapperClass}>
      <p>
        {required && <span className={styles.requiredAsterisk}>* </span>}
        {label}
      </p>
      <FormControl className={styles.form} size="small">
        <Select
          className={styles.Dropdown}
          value={value}
          onChange={onChange}
          error={error}
          displayEmpty
          fullWidth={true}
        >
          {options.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div className={styles.helperText}>{helperText}</div>
    </div>
  );
};

export default Dropdown;
