import React from "react";
import styles from "@/app/components/AdditionalInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "@/app/components";

export const AdditionalInfo = () => {
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian}>
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<img src="/dropdown.svg" />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Additional Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <SingleDetail
                title="Are you interested in a companionship animal (pet)?"
                value="No"
              />
            </div>
            <div className={styles.row}>
              <SingleDetail title="How did you hear about us?" value="Colleague" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
