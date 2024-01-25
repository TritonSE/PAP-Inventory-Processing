import React from "react";
import styles from "src/app/components/RequestedFurnishings.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "@/app/components";

export const RequestedFurnishings = () => {
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian}>
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<img src="/dropdown.svg" />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Furnishing Requests</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <SingleDetail title="Case ID" value="A0000011" />
            <SingleDetail title="Date Received" value="12-18-2024 [09:32 AM]" />
            <SingleDetail title="Status" value="Received" />
            <SingleDetail title="Last Updated" value="12-18-2024 [09:32 AM]" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
