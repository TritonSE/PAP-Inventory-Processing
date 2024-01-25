import React from "react";
import styles from "src/app/components/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "@/app/components";

export const ContactInfo = () => {
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian}>
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<img src="/dropdown.svg" />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Contact Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <SingleDetail title="Phone Number" value="(609) 712-327" />{" "}
            </div>
            <div className={styles.row}>
              <SingleDetail title="Email Address" value="justintimberlake@gmail.com" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Gender" value="Male" />
              <SingleDetail title="Age" value="34" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Street Address" value="6666 NSYNC Ave." />
              <SingleDetail title="City" value="San Diego" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Zip Code" value="92093" />
              <SingleDetail title="State" value="CA" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
