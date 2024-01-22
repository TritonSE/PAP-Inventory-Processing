import React from "react";
import styles from "src/app/components/MilitaryBackground.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "src/app/components/SingleDetail";

export const MilitaryBackground = () => {
  return (
    <div className={styles.box}>
      <Accordion>
        <AccordionSummary aria-controls="panel2-content" id="panel2-header">
          <Typography>Military Background</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <SingleDetail title="Email Address" value="JTimberlake@gmail.com" />
            <div className={styles.row}>
              <SingleDetail title="Phone Number" value="+1 (222) 333-4444" />
              <SingleDetail title="Gender" value="Male" />
              <SingleDetail title="Age" value="34" />
            </div>
            <SingleDetail title="Street Address" value="6666 NSYNC Ave" />
            <SingleDetail title="City, State, Zip" value="San Diego, CA, 92093" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
