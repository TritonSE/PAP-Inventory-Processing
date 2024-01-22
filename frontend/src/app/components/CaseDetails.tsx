import React from "react";
import styles from "src/app/components/CaseDetails.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "src/app/components/SingleDetail";

export const CaseDetails = () => {
  return (
    <div className={styles.box}>
      <Accordion>
        <AccordionSummary aria-controls="panel2-content" id="panel2-header">
          <Typography>Case Details</Typography>
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
