import React from "react";
import styles from "src/app/components/DropdownDetail.module.css";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormHelperText from "@mui/material/FormHelperText";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

export interface DropdownDetailProps {
  title: string;
  value: string;
}

export function DropdownDetail({ title, value }: DropdownDetailProps) {
  //   const handleChange = () => {};

  return (
    <div>
      <div className={styles.items}>
        <div className={styles.title}>{title}</div>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <Select
            value={value}
            // onChange={handleChange}
            displayEmpty
          >
            <MenuItem value={"Pending"}>Pending</MenuItem>
            <MenuItem value={"Appointment Schedule"}>Twenty</MenuItem>
            <MenuItem value={"Approved"}>Approved</MenuItem>
            <MenuItem value={"Resubmit"}>Resubmit</MenuItem>
            <MenuItem value={"No-show / Incomplete"}>No-show / Incomplete</MenuItem>
            <MenuItem value={"Archived"}>Archived</MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
