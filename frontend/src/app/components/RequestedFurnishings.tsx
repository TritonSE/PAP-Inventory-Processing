import React from "react";
import styles from "src/app/components/PersonalInformation.module.css";
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
            <div className={styles.row}>
              <SingleDetail title="Bedroom" value="Justin Timberlake" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Bathroom" value="6666 NSYNC Ave." />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Kitchen" value="San Diego" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Living Room:" value="CA" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Dining Room:" value="Married" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Other:" value="Jane Timberlake" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Additional Items:" value="2" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
