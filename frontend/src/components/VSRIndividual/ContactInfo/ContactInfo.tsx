import React, { useState } from "react";
import styles from "src/components/VSRIndividual/ContactInfo/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail } from "@/components/VSRIndividual";
import Image from "next/image";
import { type VSR } from "@/api/VSRs";

export interface ContactInfoProps {
  vsr: VSR;
}
export const ContactInfo = ({ vsr }: ContactInfoProps) => {
  const [expanded, setExpanded] = useState<string | false>(false);

  const handleChange = (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false);
  };
  return (
    <div className={styles.box}>
      <Accordion
        className={styles.accordian}
        expanded={expanded === "panel"}
        onChange={handleChange("panel")}
        sx={{
          paddingTop: "6px",
          "&.Mui-expanded": {
            paddingTop: "0px",
          },
        }}
      >
        <AccordionSummary
          className={styles.accordianTitle}
          expandIcon={<Image src="/dropdown.svg" width={16} height={12} alt="dropdown" />}
          aria-controls="panel2-content"
          id="panel2-header"
          sx={{
            ...(expanded === "panel" && {
              borderBottom: "1px solid rgba(214, 214, 214)",
              marginBottom: -1,
            }),
          }}
        >
          <Typography className={styles.title}>Contact Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <SingleDetail title="Phone Number" value={vsr.phoneNumber} />{" "}
            </div>
            <div className={styles.row}>
              <SingleDetail title="Email Address" value={vsr.email} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Gender" value={vsr.gender} />
              <SingleDetail className={styles.second} title="Age" value={vsr.age} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Street Address" value={vsr.streetAddress} />
              <SingleDetail className={styles.second} title="City" value={vsr.city} />
            </div>
            <div className={styles.row}>
              <SingleDetail title="Zip Code" value={vsr.zipCode} />
              <SingleDetail className={styles.second} title="State" value={vsr.state} />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
