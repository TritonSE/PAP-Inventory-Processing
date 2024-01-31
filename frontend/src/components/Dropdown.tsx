import React from "react";
import styles from "src/components/Dropdown.module.css";
import { FormControl, InputLabel, Select, MenuItem, SelectChangeEvent } from "@mui/material";

export interface DropDownProps {
  label: string;
  options: string[];
  value: string;
  onChange: (event: SelectChangeEvent<string>) => void;
  error?: boolean;
  helperText?: string;
}

const Dropdown = ({
  label,
  options,
  value,
  onChange,
  error,
  helperText,
  ...props
}: DropDownProps) => {
  return (
    <FormControl fullWidth>
      <InputLabel>{label}</InputLabel>
      <Select value={value} onChange={onChange} error={error} displayEmpty>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

export default Dropdown;
