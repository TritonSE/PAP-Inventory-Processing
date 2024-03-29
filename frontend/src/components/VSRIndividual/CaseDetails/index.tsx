import styles from "src/components/VSRIndividual/CaseDetails/styles.module.css";
import { SingleDetail, StatusDropdown } from "@/components/VSRIndividual";
import { updateVSRStatus, type VSR } from "@/api/VSRs";
import moment from "moment";
import { VSRIndividualAccordion } from "@/components/VSRIndividual/VSRIndividualAccordion";
import { STATUS_OPTIONS } from "@/components/shared/StatusDropdown";
import { StatusChip } from "@/components/shared/StatusChip";

export interface CaseDetailsProp {
  vsr: VSR;
  onUpdateVSR: (status: VSR) => void;
}

/**
 * Formats a Date object as a string in our desired format, using Moment.js library
 */
const formatDate = (date: Date) => {
  const dateMoment = moment(date);
  // We need to do 2 separate format() calls because Moment treats brackets ("[]") as escape chars
  return `${dateMoment.format("MM-DD-YYYY")} [${dateMoment.format("hh:mm A")}]`;
};

export const CaseDetails = ({ vsr, onUpdateVSR }: CaseDetailsProp) => {
  const renderStatus = () => {
    if (vsr.status === "Received" || vsr.status === undefined) {
      return (
        <StatusChip
          status={STATUS_OPTIONS.find((statusOption) => statusOption.value === "Received")!}
        />
      );
    }
    return (
      <StatusDropdown
        onChanged={async (status) => {
          const res = await updateVSRStatus(vsr._id, status);

          // TODO: error handling

          onUpdateVSR(res.success ? res.data : vsr);
        }}
        value={vsr.status != undefined ? vsr.status : "Received"}
      />
    );
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

        <SingleDetail title="Status:" value={renderStatus()} />
      </div>
    </VSRIndividualAccordion>
  );
};
