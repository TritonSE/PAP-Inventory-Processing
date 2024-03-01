import styles from "src/components/VSRIndividual/CaseDetails/styles.module.css";
import { SingleDetail, StatusDropdown } from "@/components/VSRIndividual";
import { type VSR } from "@/api/VSRs";
import moment from "moment";
import { VSRIndividualAccordion } from "../VSRIndividualAccordion";

export interface CaseDetailsProp {
  vsr: VSR;
}
export const CaseDetails = ({ vsr }: CaseDetailsProp) => {
  /**
   * Formats a Date object as a string in our desired format, using Moment.js library
   */
  const formatDate = (date: Date) => {
    const dateMoment = moment(date);
    // We need to do 2 separate format() calls because Moment treats brackets ("[]") as escape chars
    return `${dateMoment.format("MM-DD-YYYY")} [${dateMoment.format("hh:mm A")}]`;
  };

  return (
    <VSRIndividualAccordion permanentlyExpanded title="Case Details">
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

        <SingleDetail
          title="Status:"
          value={<StatusDropdown value={vsr.status != undefined ? vsr.status : "Received"} />}
        />
      </div>
    </VSRIndividualAccordion>
  );
};
