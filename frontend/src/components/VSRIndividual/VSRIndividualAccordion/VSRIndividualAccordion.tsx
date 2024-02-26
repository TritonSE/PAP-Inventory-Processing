import React, { ReactNode, useEffect, useState } from "react";
import styles from "@/components/VSRIndividual/VSRIndividualAccordion/VSRIndividualAccordion.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Image from "next/image";

export interface VSRIndividualAccordionProps {
  title: string;
  permanentlyExpanded: boolean;
  children: ReactNode;
}

export const VSRIndividualAccordion = ({
  title,
  permanentlyExpanded,
  children,
}: VSRIndividualAccordionProps) => {
  const [expanded, setExpanded] = useState(permanentlyExpanded);

  useEffect(() => {
    setExpanded(permanentlyExpanded);
  }, [permanentlyExpanded]);

  return (
    <div className={styles.box}>
      <Accordion
        className={styles.accordion}
        expanded={expanded || permanentlyExpanded}
        onChange={(e, isExpanded) => setExpanded(isExpanded || permanentlyExpanded)}
        sx={{
          paddingTop: "6px",
          "&.Mui-expanded": {
            paddingTop: "0px",
          },
        }}
      >
        <AccordionSummary
          expandIcon={
            permanentlyExpanded ? null : (
              <Image src="/dropdown.svg" width={16} height={12} alt="dropdown" />
            )
          }
          aria-controls="panel1-content"
          id="military-background-header"
          sx={{
            ...(expanded && {
              borderBottom: "1px solid rgba(214, 214, 214)", // Custom line style
              marginBottom: -1, // Adjust as needed
            }),
          }}
        >
          <Typography className={styles.title}>{title}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.details}>{children}</div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
