import React from "react";
import styles from "src/app/components/DropdownDetail.module.css";
import MenuItem from "@mui/material/MenuItem";
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
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            className={styles.select}
            value={value}
            // onChange={handleChange}
            displayEmpty
            sx={{
              boxShadow: "none",
              "& .MuiPaper-root": {
                position: "absolute",
              },
            }}
          >
            <MenuItem value={"Received"}>
              <div className={styles.received}>Received</div>
            </MenuItem>
            <MenuItem value={"Appointment Schedule"}>
              <div className={styles.scheduled}>Appointment Scheduled</div>
            </MenuItem>
            <MenuItem value={"Approved"}>
              <div className={styles.approved}>Approved</div>
            </MenuItem>
            <MenuItem value={"Resubmit"}>
              <div className={styles.resubmit}>Resubmit</div>
            </MenuItem>
            <MenuItem value={"No-show / Incomplete"}>
              <div className={styles.incomplete}>No-show / Incomplete</div>
            </MenuItem>
            <MenuItem value={"Archived"}>
              <div className={styles.archived}>Archived</div>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}