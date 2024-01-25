import React from "react";
import styles from "src/app/components/PersonalInformation.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "@/app/components";

export const PersonalInformation = () => {
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian}>
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<img src="/dropdown.svg" />}
          aria-controls="panel2-content"
          id="panel2-header"
        >
          <Typography className={styles.title}>Personal Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <SingleDetail title="Name" value="Justin Timberlake" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Street Address" value="6666 NSYNC Ave." />
            </div>
            <div className={styles.row}>
              <SingleDetail title="City" value="San Diego" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="State" value="CA" />
              <SingleDetail title="Zip Code" value="92092" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Marital Status" value="Married" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Spouse's Name" value="Jane Timberlake" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Number of boy(s)" value="2" />
              <SingleDetail title="Age(s)" value="10,12" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Number of girl(s)" value="2" />
              <SingleDetail title="Age(s)" value="10,12" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Ethnicity" value="Caucasian" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Employment Status" value="Currenlty Looking" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Income Level" value="$12,500 and under" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Size of Home" value="Apartment" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
