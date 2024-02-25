import styles from "src/components/VSRIndividual/CaseDetails/CaseDetails.module.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import { SingleDetail, DropdownDetail } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import moment from "moment";

export interface CaseDetailsProp {
  vsr: VSR;
}
export const CaseDetails = ({ vsr }: CaseDetailsProp) => {
  const expanded = true;

  /**
   * Formats a Date object as a string in our desired format, using Moment.js library
   */
  const formatDate = (date: Date) => {
    const dateMoment = moment(date);
    // We need to do 2 separate format() calls because Moment treats brackets ("[]") as escape chars
    return `${dateMoment.format("MM-DD-YYYY")} [${dateMoment.format("hh:mm A")}]`;
  };

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
            <SingleDetail title="Case ID:" value={vsr._id} valueFontSize="20px" />
            <SingleDetail
              title="Date Received:"
              value={formatDate(vsr.dateReceived)}
              valueFontSize="20px"
            />
            <SingleDetail
              title="Last Updated:"
              value={formatDate(vsr.lastUpdated)}
              valueFontSize="20px"
            />
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
