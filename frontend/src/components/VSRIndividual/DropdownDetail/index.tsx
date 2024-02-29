import React, { useState } from "react";
import styles from "src/components/VSRIndividual/DropdownDetail/styles.module.css";
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
    <Image
      src="/keyboard_arrow_down24.svg"
      width={24}
      height={24}
      alt="dropdown"
      style={{
        // We need these styles in order to make our custom IconComponent clickable.
        // See https://stackoverflow.com/a/73038614
        position: "absolute",
        right: 7,
        pointerEvents: "none",
      }}
    />
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
                padding: "0px",

                // This right padding keeps the dropdown arrow from being
                // colored in like the menu itmes
                ":first-of-type": { paddingRight: "32px" },
              },

              // Override default blue border on Select component when focused
              // See https://stackoverflow.com/a/75937349
              fieldset: {
                border: "none !important",
              },
            }}
            MenuProps={{
              disableScrollLock: true,
              // Left-align menu items with Select component
              // See https://stackoverflow.com/a/64932005
              anchorOrigin: {
                vertical: "bottom",
                horizontal: "left",
              },
              transformOrigin: {
                vertical: "top",
                horizontal: "left",
              },

              style: {
                // Add vertical gap between Select component and its menu items
                marginTop: "8px",
              },

              sx: {
                // Set padding on each menu item
                ".MuiMenuItem-root": {
                  padding: "12px",
                },
              },
            }}
            IconComponent={DropdownIcon}
          >
            <MenuItem value={"Received"}>
              <div className={`${styles.statusOption} ${styles.received}`}>Received</div>
            </MenuItem>
            <MenuItem value={"Appointment Schedule"}>
              <div className={`${styles.statusOption} ${styles.scheduled}`}>
                Appointment Scheduled
              </div>
            </MenuItem>
            <MenuItem value={"Approved"}>
              <div className={`${styles.statusOption} ${styles.approved}`}>Approved</div>
            </MenuItem>
            <MenuItem value={"Resubmit"}>
              <div className={`${styles.statusOption} ${styles.resubmit}`}>Resubmit</div>
            </MenuItem>
            <MenuItem value={"No-show / Incomplete"}>
              <div className={`${styles.statusOption} ${styles.incomplete}`}>
                No-show / Incomplete
              </div>
            </MenuItem>
            <MenuItem value={"Archived"}>
              <div className={`${styles.statusOption} ${styles.archived}`}>Archived</div>
            </MenuItem>
          </Select>
        </FormControl>
      </div>
    </div>
  );
}
