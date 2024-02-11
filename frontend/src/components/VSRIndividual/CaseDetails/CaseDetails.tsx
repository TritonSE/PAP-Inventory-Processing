import styles from "src/components/VSRIndividual/CaseDetails/CaseDetails.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, DropdownDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";

export interface CaseDetailsProp {
  vsr: VSR;
}
export const CaseDetails = ({ vsr }: CaseDetailsProp) => {
  const expanded = true;
  return (
    <div className={styles.box}>
      <Accordion className={styles.accordian} defaultExpanded expanded={expanded}>
        <AccordionSummary
          className={styles.accordianTitle}
          aria-controls="panel1-content"
          id="case-details-header"
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
