import React, { useState } from "react";
import styles from "src/components/VSRIndividual/ContactInfo/ContactInfo.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { ListDetail } from "@/components/VSRIndividual";
import Image from "next/image";
import { type VSR } from "@/api/VSRs";

export interface AdditionalInfoProps {
  vsr: VSR;
}

export const AdditionalInfo = ({ vsr }: AdditionalInfoProps) => {
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
          aria-controls="panel1-content"
          id="additional-info-header"
          sx={{
            ...(expanded === "panel" && {
              borderBottom: "1px solid rgba(214, 214, 214)", // Custom line style
              marginBottom: -1, // Adjust as needed
            }),
          }}
        >
          <Typography className={styles.title}>Additional Information</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>
            <div className={styles.row}>
              <ListDetail
                title="Are you interested in a companionship animal (pet)?"
                values={[vsr.petCompanion]}
              />
            </div>
            <div className={styles.row}>
              <ListDetail title="How did you hear about us?" values={[vsr.hearFrom]} />
            </div>
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
