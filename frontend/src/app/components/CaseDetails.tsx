import React from "react";
import styles from "src/app/components/CaseDetails.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, DropdownDetail } from "@/app/components";

export const CaseDetails = () => {
  const expanded = true;
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian} defaultExpanded expanded={expanded}>
        <AccordionSummary
          className={styles.accordianTitle}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Case Details</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <SingleDetail title="Case ID:" value="A0000011" valueFontSize="20px" />
            <SingleDetail
              title="Date Received:"
              value="12-18-2024 [09:32 AM]"
              valueFontSize="20px"
            />
            <SingleDetail
              title="Last Updated:"
              value="12-18-2024 [09:32 AM]"
              valueFontSize="20px"
            />
            <DropdownDetail title="Status:" value="Received" />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
