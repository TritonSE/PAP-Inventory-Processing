import React, { useEffect, useState } from "react";
import styles from "src/app/components/CaseDetails.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, DropdownDetail } from "@/app/components";
import { useParams } from "next/navigation";
import { getVSR, type VSR } from "@/api/VSRs";

export const CaseDetails = () => {
  const [vsr, setVSR] = useState<VSR>({} as VSR);
  const { id } = useParams();

  useEffect(() => {
    getVSR(id as string).then((result) => {
      if (result.success) {
        setVSR(result.data);
      }
    });
  }, [id]);
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
            <SingleDetail title="Case ID:" value={vsr.caseId} valueFontSize="20px" />
            <SingleDetail title="Date Received:" value={vsr.dateReceived} valueFontSize="20px" />
            <SingleDetail title="Last Updated:" value={vsr.lastUpdated} valueFontSize="20px" />
            <DropdownDetail
              title="Status:"
              value={vsr.status != undefined ? vsr.status : "Received"}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
};
