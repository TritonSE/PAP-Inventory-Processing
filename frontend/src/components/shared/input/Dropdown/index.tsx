import React from "react";
import styles from "@/components/shared/input/Dropdown/styles.module.css";
import { FormControl, Select, MenuItem, SelectChangeEvent } from "@mui/material";
import { FormField } from "@/components/shared/input/FormField";
import { useScreenSizes } from "@/hooks/useScreenSizes";

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

/**
 * An input component that displays a dropdown and enables the user to select one
 * of the options from the dropdown.
 */
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
  const { isMobile, isTablet } = useScreenSizes();

  return (
    <FormField label={label} required={required} error={error} helperText={helperText}>
      <FormControl className={styles.form} size="small">
        <Select
          className={styles.dropDown}
          value={value}
          onChange={onChange}
          error={error}
          displayEmpty
          fullWidth
          renderValue={(value) =>
            value === "" ? <p className={styles.placeholder}> {placeholder}</p> : value
          }
          sx={{
            ".MuiSelect-select": {
              padding: "6px 12px",
              minHeight: "unset !important",
              height: isMobile ? 16 : isTablet ? 19 : 22,
            },
          }}
          MenuProps={{
            disableScrollLock: true,
          }}
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
    </FormField>
  );
};

export default Dropdown;
