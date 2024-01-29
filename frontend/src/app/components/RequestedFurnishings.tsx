import React from "react";
import styles from "src/app/components/PersonalInformation.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, ListDetail } from "@/app/components";

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
              <ListDetail title="Bedroom" values={["Twin Mat.", "Dresser"]} />
            </div>
            <div className={styles.row}>
              <ListDetail title="Bathroom" values={["Bath Rug(s): 2"]} />
            </div>
            <div className={styles.row}>
              <ListDetail title="Kitchen" values={["Cups", "Pots and Pans"]} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Living Room:" value="No items selected" />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Dining Room:" value="No items selected" />
            </div>
            <div className={styles.row}>
              <ListDetail title="Other:" values={["Washer"]} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Additional Items:" value="n/a" />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
