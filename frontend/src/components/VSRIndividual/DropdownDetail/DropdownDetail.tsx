import React, { useState } from "react";
import styles from "src/components/VSRIndividual/DropdownDetail/DropdownDetail.module.css";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Image from "next/image";

export interface DropdownDetailProps {
  title: string;
  value: string;
}

export function DropdownDetail({ title, value }: DropdownDetailProps) {
  const DropdownIcon = () => (
    <Image src="/keyboard_arrow_down24.svg" width={24} height={24} alt="dropdown" />
  );

  const [selectedValue, setSelectedValue] = useState(value);

  const handleChange = (event: { target: { value: React.SetStateAction<string> } }) => {
    setSelectedValue(event.target.value);
  };

  return (
    <div>
      <div className={styles.items}>
        <div className={styles.title}>{title}</div>
        <FormControl sx={{ minWidth: 120 }}>
          <Select
            className={styles.select}
            value={selectedValue}
            onChange={handleChange}
            displayEmpty
            sx={{
              boxShadow: "none",
              ".MuiOutlinedInput-notchedOutline": { border: 0 },
              ".MuiOutlinedInput-input.MuiSelect-select": {
                paddingLeft: "0px",
                paddingRight: "0px",
                paddingTop: "0px",
                paddingBottom: "0px",
                ":first-of-type": { paddingRight: "8px" },
              },
            }}
            MenuProps={{
              disableScrollLock: true,
            }}
            IconComponent={DropdownIcon}
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
